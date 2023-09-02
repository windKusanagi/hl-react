pragma solidity >=0.5.10 <0.9.0;

/**
 * @title Hashed Time Lock Contract.
 *
 * This contract can swap tokens between
 * users (Alice and Bob) on different EVM
 * based blockchain.
 */
contract HashedTimeLock {

    // Struct
    struct LockedTx {
        address payable sender;
        address payable receiver;
        uint amount;
        bytes32 hashlock;
        uint timelock;
        bool withdrawn;
        bool refunded;
        bytes32 key;
    }

    // Constants

    // Storage
    mapping (bytes32 => LockedTx) transactions;

    // Modifiers
    modifier isTxValuable() {
        require(msg.value > 0, "msg.value should be greater than 0");
        _;
    }
    modifier isTimeInFuture(uint _time) {
        require(_time > block.timestamp, "timelock time must be in the future");
        _;
    }
    modifier isTxExists(bytes32 _txId) {
        require(txExists(_txId), "txId does not exist");
        _;
    }
    modifier isHashLockMatches(bytes32 _txId, bytes32 _key) {
        require(
            transactions[_txId].hashlock == sha256(abi.encodePacked(_key)),
            "hashlock hash does not match"
        );
        _;
    }
    modifier withdrawable(bytes32 _txId) {
        require(transactions[_txId].receiver == msg.sender, "only receiver can withdraw");
        require(transactions[_txId].withdrawn == false, "this transaction already withdrawn");
        require(transactions[_txId].timelock > block.timestamp, "timelock time must be in the future");
        _;
    }
    modifier refundable(bytes32 _txId) {
        require(transactions[_txId].sender == msg.sender, "only sender can refund");
        require(transactions[_txId].refunded == false, "this transaction already refunded");
        require(transactions[_txId].withdrawn == false, "this transaction already withdrawn");
        require(transactions[_txId].timelock <= block.timestamp, "timelock not yet expired");
        _;
    }

    // Events
    event LogNewTransaction(
        bytes32 indexed txId,
        address indexed sender,
        address indexed receiver,
        uint amount,
        bytes32 hashlock,
        uint timelock
    );
    event LogWithdraw(bytes32 indexed txId, address sender, uint balance);
    event LogRefund(bytes32 indexed txId, address sender, uint balance);


    /// External functions
    /**
     * @dev Sender create a new hash time lock transaction.
     *
     * @param _receiver Receiver address.
     * @param _hashlock A bytes32 sha256 hash.
     * @param _timelock UNIX epoch seconds time that the lock expires at.
     *                  Refunds can be made after this time.
     * @return txId Id of the new HTLC.
     */
    function newTransaction(address payable _receiver, bytes32 _hashlock, uint _timelock)
    external
    payable
    isTxValuable
    isTimeInFuture(_timelock)
    returns (bytes32 txId)
    {
        txId = sha256(abi.encodePacked(msg.sender, _receiver, msg.value, _hashlock, _timelock));

        if (txExists(txId)) {
            revert("Transaction already exists");
        }

        transactions[txId] = LockedTx(msg.sender, _receiver, msg.value, _hashlock, _timelock, false, false, 0x0);

        emit LogNewTransaction(txId, msg.sender, _receiver, msg.value, _hashlock, _timelock);
    }

    /**
     * @dev If receiver know the secret key preimage of the hashlock.
     * They can get the locked funds to their address by call this function.
     *
     * @param _txId Id of the HTLC.
     * @param _key sha256(_key) should equal the transaction hashlock.
     * @return bool true on success
     */
    function withdraw(bytes32 _txId, bytes32 _key)
    external
    isTxExists(_txId)
    isHashLockMatches(_txId, _key)
    withdrawable(_txId)
    returns (bool)
    {
        LockedTx storage c = transactions[_txId];
        c.key = _key;
        c.withdrawn = true;
        c.receiver.transfer(c.amount);
        emit LogWithdraw(_txId, c.receiver, c.receiver.balance);
        return true;
    }

    /**
     * @dev If there was no withdraw AND the time lock has
     * expired. sender can refund by call this function.
     *
     * @param _txId Id of HTLC to refund from.
     * @return bool true on success
     */
    function refund(bytes32 _txId)
    external
    isTxExists(_txId)
    refundable(_txId)
    returns (bool)
    {
        LockedTx storage c = transactions[_txId];
        c.refunded = true;
        c.sender.transfer(c.amount);
        emit LogRefund(_txId, c.sender, c.sender.balance);
        return true;
    }

    /// Public functions

    /**
     * @dev Get transaction details.
     * @param _txId HTLC transaction id
     * @return sender receiver amount hashlock timelock refunded withdrawn key,
            All parameters in struct LockedTx for _txId HTLC
     */
    function getTransaction(bytes32 _txId)
    public
    view
    returns (
        address sender,
        address receiver,
        uint amount,
        bytes32 hashlock,
        uint timelock,
        bool withdrawn,
        bool refunded,
        bytes32 key
    )
    {
        if (!txExists(_txId)) {
            return (address(0), address(0), 0, 0, 0, false, false, 0);
        }

        LockedTx storage c = transactions[_txId];
        return (c.sender, c.receiver, c.amount, c.hashlock, c.timelock, c.withdrawn, c.refunded, c.key);
    }

    /// Internal functions
    /**
     * @dev Is there a transaction with id _txId.
     * @param _txId Id into transactions mapping.
     */
    function txExists(bytes32 _txId)
    internal
    view
    returns (bool exists)
    {
        return transactions[_txId].sender != address(0);
    }

    /// Private functions

}
