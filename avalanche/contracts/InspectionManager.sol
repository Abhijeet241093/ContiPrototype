// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract InspectionManager {
   using Counters for Counters.Counter;
    Counters.Counter private _inpsecIds;
    mapping(string => uint256[]) private projectIdidToInspec;
    mapping(uint256 => InpsectionResult) private idToInspec;
    struct InpsectionResult {
        string projectId;
        string location;
        string time;
        string detectionClass;
        string detectionResult;
        string imageHash;
        string imageStorageAddress;
    }

    event InspectionResultCreated(uint256);

    constructor() {}

    function createInspection(
        string memory projectId,
        string memory location,
        string memory time,
        string memory detectionClass,
        string memory detectionResult,
        string memory imageHash,
        string memory imageStorageAddress
    ) public {
        _inpsecIds.increment();
        uint256 newTokenId = _inpsecIds.current();
        InpsectionResult memory _inspecRsult = InpsectionResult(
            projectId,
            location,
            time,
            detectionClass,
            detectionResult,
            imageHash,
            imageStorageAddress
        );
        idToInspec[newTokenId] = _inspecRsult;
        projectIdidToInspec[projectId].push(newTokenId);
        emit InspectionResultCreated(newTokenId);
    }

    function getInpsectionByProjectId(string memory projectId)
        external
        view
        returns (uint256[] memory inpecs)
    {
        inpecs = projectIdidToInspec[projectId];
        return inpecs;
    }

    function getItemInfor(uint256[] calldata listItems) external view returns (InpsectionResult[] memory items) {
        // Returns an array of items that the user owns
        items = new InpsectionResult[](listItems.length);
        uint256 _counter = 0;
        for (uint256 i = 0; i < listItems.length; i++) { // for each auction
           items[_counter] =  idToInspec[listItems[i]] ;// i; // add the item to the array
            _counter++; // increase the counter
        }
        return items;
    }
}
