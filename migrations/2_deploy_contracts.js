const HashedTimeLock = artifacts.require('./HashedTimeLock.sol')

module.exports = function (deployer) {
    deployer.deploy(HashedTimeLock)
}