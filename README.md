Cryptocurrencies Normalizr
==========================

[![build status](https://gitlab.com/x-data/x-cryptocurrencies-normalizr/badges/master/build.svg)](https://gitlab.com/x-data/x-cryptocurrencies-normalizr/commits/master)
[![coverage](https://gitlab.com/x-data/x-cryptocurrencies-normalizr/badges/master/coverage.svg?job=test)](https://gitlab.com/x-data/x-cryptocurrencies-normalizr/commits/master)

A normalizer/denormalizer for cryptocurrency pairs and symbols

With this library you can normalize a pair or a currency symbol

A pair: `BCC_ETH`
A currency: `BTC`

Normalize
---------

Pair usage example:

    const Normalize = require('cryptocurrencies-normalizr')
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

Currency usage example:

    const Normalize = require('cryptocurrencies-normalizr')
    Normalize.currency('BCC')
    Normalize.currency('XBT')

It will output:

    BCH
    BTC

Denormalize
-----------

The denormalization requires the pair and the exchange name

Usage example:

    const Normalize = require('cryptocurrencies-normalizr')
    Normalize.denormalize.pair('BCH-BTC', 'binance')

It will output the pair in the exchange:

    BCCBTC

Find matches
------------

It's possible to find matches between the exchange symbols, here's an example:

    const Normalizr = require('cryptocurrencies-normalizr')
    const matches = Normalizr.findMatches()

The matches will be returned in an array with normalized symbols.

Currently allowed exchange names:

| Exchange name |
|---------------|
| binance       |
| bittrex       |

Below you can see a table with the known alternatives
for symbols.

| Standard | Alternatives     |
|----------|------------------|
| BTC      | BTC, XBT         |
| IOTA     | IOTA, MIOTA, IOT |
| BCH      | BCH, BCC, BCY    |
