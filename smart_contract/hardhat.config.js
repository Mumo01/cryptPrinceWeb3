require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks:  {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/bFx7PP15f9iGFa5KtID0RO2WN1bRyhhV',
      accounts: [ '51a1431f6936b5b3f9a65b1e4fa4d454c59f30f8dd7599eb12baa7298bf88b0d' ]
    },
  },
};