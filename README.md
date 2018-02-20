Exchange Cryptocurrencies Normalizr
===================================

A normalizer for cryptocurrency pairs and symbols

With this library you can normalize a pair or a currency symbol

A pair: `BCC_ETH`
A currency: `BTC`

Pair usage example:

    Normalize = require('x-cryptocurrencies-normalizr')
    Normalize.pair('BCC_ETH', '_')
    Normalize.pair('BCY/XBT', '/')
    Normalize.pair('BTCUSDT', '', 'binance')
    Normalize.pair('MIOTABTC', null, 'binance')

It will output:

    BCH-ETH
    BCH-BTC
    BTC-USDT
    IOTA-BTC

The first parameter is the pair (`BCC_ETH`, `BCY/XBC`)
The second parameter is the delimiter that separates each pair (`_`, `/`)
The third parameter is optional if a delimiter is provided and exists in the given pair, if there is no delimiter to separate the pair, this parameter becomes required.

Currently allowed exchange names:

| Exchange name |
|---------------|
| binance       |

Currency usage example:

    Normalize = require('x-cryptocurrencies-normalizr')
    Normalize.currency('BCC')
    Normalize.currency('XBT')

It will output:

    BCH
    BTC

Below you can see a table with the known alternatives
for symbols.

| Standard | Alternatives     |
|----------|------------------|
| BTC      | BTC, XBT         |
| IOTA     | IOTA, MIOTA, IOT |
| BCH      | BCH, BCC, BCY    |
