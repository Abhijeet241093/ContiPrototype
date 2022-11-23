// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TaskManager {
    using Counters for Counters.Counter;
    Counters.Counter private _taskIds;
    mapping(string => uint256[]) private projectIdToTask;
    mapping(uint256 => Task) private idToTask;
    struct Task {
        string projectId;
        string instructor;
        string activityId;
        string location;
        string duration;
        string worker;
        string currentStep;
        string status;
        address walletAddress;
    }

    event TaskCreated(uint256);
    event TaskUpdated(uint256);
    event TaskCompleted(uint256);

    constructor() {}

    function createTask(
        string memory projectId,
        string memory instructor,
        string memory activityId,
        string memory location,
        string memory duration,
        string memory worker,
        string memory currentStep,
        string memory status,
        address walletAddress
    ) public {
        _taskIds.increment();
        uint256 newTokenId = _taskIds.current();
        Task memory _task = Task(
            projectId,
            instructor,
            activityId,
            location,
            duration,
            worker,
            currentStep,
            status,
            walletAddress
        );
        idToTask[newTokenId] = _task;
        projectIdToTask[projectId].push(newTokenId);
        emit TaskCreated(newTokenId);
    }

    function getTasksByProjectId(string memory projectId)
        external
        view
        returns (uint256[] memory tasks)
    {
        tasks = projectIdToTask[projectId];
        return tasks;
    }

    function getItemInfor(uint256[] calldata listItems)
        external
        view
        returns (Task[] memory items)
    {
        // Returns an array of items that the user owns
        items = new Task[](listItems.length);
        uint256 _counter = 0;
        for (uint256 i = 0; i < listItems.length; i++) {
            // for each auction
            items[_counter] = idToTask[listItems[i]]; // i; // add the item to the array
            _counter++; // increase the counter
        }
        return items;
    }

    function updateTask(uint256 _tokenId, string calldata currentStep) public {
        Task storage task = idToTask[_tokenId];
        task.currentStep = currentStep;
        emit TaskUpdated(_tokenId);
    }

    function updateLastStepTask(uint256 _tokenId, string calldata currentStep)
        public
    {
        Task storage task = idToTask[_tokenId];
        task.currentStep = currentStep;
        task.status = "pending";
        emit TaskUpdated(_tokenId);
    }

    function confirmTask(uint256 _tokenId, uint256 _amount) public payable {
        require(msg.value > 0, "The token need to more than 0");
        Task storage task = idToTask[_tokenId];
        (bool success, ) = task.walletAddress.call{value: _amount}("");
        require(success, "Failed to send AVAX");

        task.status = "success";
        emit TaskCompleted(_tokenId);
    }
}
