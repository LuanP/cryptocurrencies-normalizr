const fs = require('fs')
const axios = require('axios')
const assert = require('chai').assert
const expect = require('chai').expect
const sinon = require('sinon')

const Binance = require('./binance')
const symbols = require('./symbols')

describe('binance', () => {
  let stubrequest = sinon.stub(axios, 'get')
  let stubfs = sinon.stub(fs, 'writeFile')

  beforeEach(() => {
    stubrequest.reset()
    stubfs.reset()
  })

  after(() => {
    stubrequest.restore()
    stubfs.restore()
  })

  it('successfully downloads symbols', (done) => {
    stubrequest.resolves({
      data: {
        symbols: symbols
      }
    })

    stubfs.yields(null)

    Binance.downloadSymbols()
      .then((data) => {
        expect(data).to.deep.include.members(symbols)

        assert.strictEqual(stubfs.calledOnce, true, 'symbols updated once')
        assert.strictEqual(stubrequest.calledOnce, true, 'requested binance api once')

        done()
      })
      .catch((err) => {
        throw err
      })
  })

  // it('throws when saving file trying to downloads symbols', (done) => {
  //   stubrequest.resolves({
  //     data: {
  //       symbols: symbols
  //     }
  //   })

  //   stubfs.onCall().yields(new Error('failed to write'))

  //   Binance.downloadSymbols()
  //     .then((data) => {
  //       expect(data).to.deep.include.members(symbols)

  //       assert.strictEqual(stubfs.calledOnce, true, 'symbols updated once')
  //       assert.strictEqual(stubrequest.calledOnce, true, 'requested binance api once')

  //       assert.throws(stubfs, Error, 'failed to write')

  //       done()
  //     })
  //     .catch((err) => {
  //       throw err
  //     })
  // })
})
