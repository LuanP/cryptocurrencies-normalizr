const assert = require('chai').assert

const Normalizer = require('./index')

describe('cryptocurrencies-normalizr', () => {
  describe('normalizer', () => {
    describe('pairs', () => {
      it('changes BCC_ETH to BCH-ETH', (done) => {
        const pair = Normalizer.pair('BCC_ETH', '_')

        assert.strictEqual(pair, 'BCH-ETH', 'returned normalized pair')

        done()
      })

      it('changes BCY/XBT to BCH-BTC', (done) => {
        const pair = Normalizer.pair('BCY/XBT', '/')

        assert.strictEqual(pair, 'BCH-BTC', 'returned normalized pair')

        done()
      })

      it('sends a pair without delimiter and with an exchange name', (done) => {
        const pair = Normalizer.pair('BNBBTC', null, 'binance')

        assert.strictEqual(pair, 'BNB-BTC', 'returned normalized pair')

        done()
      })

      it('sends a pair without delimiter and without an exchange name', (done) => {
        const fn = () => Normalizer.pair('MIOTABTC')

        assert.throws(fn, Error, 'you should provide at least the delimiter or the exchange name')

        done()
      })

      it('sends a pair without delimiter and with an exchange name, but it does not exist in the exchange', (done) => {
        const fn = () => Normalizer.pair('MIOTABTC', null, 'binance')

        assert.throws(fn, Error, 'the pair MIOTABTC does not exist in the exchange binance')

        done()
      })

      it('does not send the pair and throws Error', (done) => {
        const fn = () => Normalizer.pair()

        assert.throws(fn, Error, 'you must inform a pair to be normalized')

        done()
      })

      it('sends the wrong delimiter and throws Error', (done) => {
        const fn = () => Normalizer.pair('BTC-LTC', '_')

        assert.throws(fn, Error, 'the pair BTC-LTC does not contain the delimiter "_"')

        done()
      })

      it('sends an unavailable exchange name and throws Error', (done) => {
        const fn = () => Normalizer.pair('BTCLTC', null, 'unavailable')

        assert.throws(fn, Error, 'exchange unavailable')

        done()
      })
    })

    describe('currencies', () => {
      it('changes XBT to BTC', (done) => {
        const currency = Normalizer.currency('XBT')

        assert.strictEqual(currency, 'BTC', 'returned normalized BTC value')

        done()
      })

      it('changes MIOTA to IOTA', (done) => {
        const currency = Normalizer.currency('MIOTA')

        assert.strictEqual(currency, 'IOTA', 'returned normalized IOTA value')

        done()
      })

      it('receives BTC and returns the same value', (done) => {
        const currency = Normalizer.currency('BTC')

        assert.strictEqual(currency, 'BTC', 'returned normalized BTC value')

        done()
      })

      it('receives an unmapped value and returns itself', (done) => {
        const currency = Normalizer.currency('SC')

        assert.strictEqual(currency, 'SC', 'returned the same value')

        done()
      })
    })
  })

  describe('denormalizer', () => {
    it('successfully denormalizes a binance pair', (done) => {
      const pair = Normalizer.denormalize.pair('BCH-BTC', 'binance')

      assert.strictEqual(pair, 'BCCBTC', 'binance denormalized pair')
      done()
    })

    it('throws error if no pair is informed', (done) => {
      const fn = () => Normalizer.denormalize.pair()

      assert.throws(fn, Error, 'inform a pair to be denormalized')

      done()
    })

    it('throws error if no exchange is informed', (done) => {
      const fn = () => Normalizer.denormalize.pair('BCH-BTC')

      assert.throws(fn, Error, 'impossible to denormalize without exchange name')

      done()
    })

    it('throws error if exchange is unavailable', (done) => {
      const fn = () => Normalizer.denormalize.pair('BCH-BTC', 'unknown')

      assert.throws(fn, Error, 'exchange unavailable')

      done()
    })
  })
})
