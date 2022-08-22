// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarketplace__PriceLessThanZero();
error NftMarketplace__NotApprovForMarketplace();
error NftMarketplace__NftAlreadyList(
    address nftAddress,
    uint256 tokenId,
    address seller
);
error NftMarketplace__NotOwnerOfNft();
error NftMarketplace__NftNotList(address nftAddress, uint256 tokenId);
error NftMarketplace__NotEnoughEthToBuy(
    address nftAddress,
    uint256 tokenId,
    uint256 listPrice
);

contract NftMarketplace is ReentrancyGuard {
    /*
      Sale a NFT to contract can do in two way.
      1. Send NFT to contract. It cause a lot of gas and owner don't have power to control thier asset.
      2. Just approve contract marketplace to sold in behalf of owner.
      With this method, owner will still have power to control thier asset and cheap gas.
    */

    struct Listing {
        uint256 price;
        address seller;
    }
    // nftAddress => tokenId => price, seller
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_sellerFunds;

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    // modifier
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address seller
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];

        if (listing.price > 0) {
            revert NftMarketplace__NftAlreadyList(nftAddress, tokenId, seller);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address seller
    ) {
        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != seller) {
            revert NftMarketplace__NotOwnerOfNft();
        }

        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NftMarketplace__NftNotList(nftAddress, tokenId);
        }
        _;
    }

    /*
     * @notice Method for list nft to marketplace
     * @param nftAddress: address of nft
     * @paran tokenId: token id of the nft
     * @param price: Determine price to sell this nft
     * @dev This use 2nd options to sell NFT.
     * @enchance By accept other token as well such DAI or BTC and convert to ETH.
     */

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NftMarketplace__PriceLessThanZero();
        }

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) == address(this)) {
            revert NftMarketplace__NotApprovForMarketplace();
        }

        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
    {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (msg.value < listing.price) {
            revert NftMarketplace__NotEnoughEthToBuy(
                nftAddress,
                tokenId,
                listing.price
            );
        }
        // not transfer directly
        s_sellerFunds[listing.seller] += msg.value;
        delete s_listings[nftAddress][tokenId];
        IERC721(nftAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );
        emit ItemBought(msg.sender, nftAddress, tokenId, listing.price);
    }
}
