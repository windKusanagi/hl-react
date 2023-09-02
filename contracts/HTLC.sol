import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// SPDX-License-Identifier: MIT
pragma solidity >=0.5.10 <0.9.0;

abstract contract TokenInterface {
    function transfer(address to, uint tokens) public virtual returns (bool);

    function transferFrom(
        address from,
        address to,
        uint tokens
    ) public virtual returns (bool);
}

contract OptimizedHashLock {
    struct TimeLockedTransfer {
        address initiator;
        address beneficiary;
        uint value;
        bytes32 secretHash;
        uint expiryTime;
        bool isFundsClaimed;
        bool isFundsSentBack;
        bytes32 preimage;
        address tokenContractAddress;
    }

    mapping(bytes32 => TimeLockedTransfer) public pendingTransfers;

    event TransferInitiated(
        bytes32 indexed transactionID,
        address initiator,
        address beneficiary,
        uint value,
        bytes32 secretHash,
        uint expiryTime,
        address tokenContract
    );
    event FundsClaimed(bytes32 indexed transactionID);
    event FundsSentBack(bytes32 indexed transactionID);

    function initiateTransfer(
        address _beneficiary,
        bytes32 _secretHash,
        uint _duration,
        address _tokenContractAddress
    ) external payable returns (bytes32 transactionID) {
        require(_duration > 0, "Duration should be positive");

        transactionID = keccak256(
            abi.encodePacked(
                msg.sender,
                _beneficiary,
                msg.value,
                _secretHash,
                block.timestamp
            )
        );

        TimeLockedTransfer memory newTransfer;
        newTransfer.initiator = msg.sender;
        newTransfer.beneficiary = _beneficiary;
        newTransfer.value = msg.value;
        newTransfer.secretHash = _secretHash;
        newTransfer.expiryTime = block.timestamp + _duration;
        newTransfer.tokenContractAddress = _tokenContractAddress;

        pendingTransfers[transactionID] = newTransfer;

        emit TransferInitiated(
            transactionID,
            msg.sender,
            _beneficiary,
            msg.value,
            _secretHash,
            newTransfer.expiryTime,
            _tokenContractAddress
        );
    }

    function claimFunds(bytes32 _transactionID, bytes32 _secret) external {
        TimeLockedTransfer storage targetTransfer = pendingTransfers[
            _transactionID
        ];

        require(targetTransfer.beneficiary == msg.sender, "Unauthorized");
        require(
            targetTransfer.isFundsClaimed == false,
            "Funds already claimed"
        );
        require(
            keccak256(abi.encodePacked(_secret)) == targetTransfer.secretHash,
            "Invalid secret"
        );
        require(
            block.timestamp <= targetTransfer.expiryTime,
            "Time for claiming has expired"
        );

        targetTransfer.isFundsClaimed = true;
        targetTransfer.preimage = _secret;

        if (targetTransfer.tokenContractAddress == address(0)) {
            payable(msg.sender).transfer(targetTransfer.value);
        } else {
            TokenInterface token = TokenInterface(
                targetTransfer.tokenContractAddress
            );
            require(
                token.transfer(msg.sender, targetTransfer.value),
                "Token transfer failed"
            );
        }

        emit FundsClaimed(_transactionID);
    }

    function sendBackFunds(bytes32 _transactionID) external {
        TimeLockedTransfer storage targetTransfer = pendingTransfers[
            _transactionID
        ];

        require(targetTransfer.initiator == msg.sender, "Unauthorized");
        require(
            targetTransfer.isFundsSentBack == false,
            "Funds already sent back"
        );
        require(
            block.timestamp > targetTransfer.expiryTime,
            "Cannot send back before expiry"
        );

        targetTransfer.isFundsSentBack = true;

        if (targetTransfer.tokenContractAddress == address(0)) {
            payable(msg.sender).transfer(targetTransfer.value);
        } else {
            TokenInterface token = TokenInterface(
                targetTransfer.tokenContractAddress
            );
            require(
                token.transfer(msg.sender, targetTransfer.value),
                "Token transfer failed"
            );
        }

        emit FundsSentBack(_transactionID);
    }
}
