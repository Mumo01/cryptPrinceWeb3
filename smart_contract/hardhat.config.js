require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks:  {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/bFx7PP15f9iGFa5KtID0RO2WN1bRyhhV',
      accounts: [ 'privatekey' ]
    },
  },
};
