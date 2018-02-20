const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const availableSymbols = require('./symbols')

const Binance = () => {}

Binance.BASE_URL = 'https://api.binance.com'
Binance.exchangeInfo = '/api/v1/exchangeInfo'

Binance.downloadSymbols = async () => {
  const url = `${Binance.BASE_URL}${Binance.exchangeInfo}`
  let availableSymbols = []

  return axios.get(url)
    .then((res) => {
      const symbols = res.data.symbols

      for (let i = 0; i < symbols.length; i++) {
        let symbol = symbols[i]

        availableSymbols.push({
          baseAsset: symbol.baseAsset,
          quoteAsset: symbol.quoteAsset,
          symbol: symbol.symbol
        })
      }

      return availableSymbols
    })
    .then((availableSymbols) => {
      const filepath = path.join(__dirname, 'symbols.json')
      const filedata = JSON.stringify(availableSymbols, null, 2)
      fs.writeFile(filepath, filedata, (err) => {
        if (err) throw err

        console.log(chalk.green('successfully updated binance symbols'))
      })

      return availableSymbols
    })
}

// Binance.downloadSymbols()
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2))
//   })
//   .catch((err) => { console.error(chalk.red(err)) })

Binance.load = () => {
  return availableSymbols
}

module.exports = Binance
