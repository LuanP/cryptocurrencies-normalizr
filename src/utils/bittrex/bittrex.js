const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const availableSymbols = require('./symbols')

const Bittrex = () => {}

Bittrex.BASE_URL = 'https://bittrex.com'
Bittrex.exchangeInfo = '/api/v1.1/public/getmarkets'
Bittrex.symbolDelimiter = '-'

Bittrex.downloadSymbols = async () => {
  const url = `${Bittrex.BASE_URL}${Bittrex.exchangeInfo}`
  let availableSymbols = []

  return axios.get(url)
    .then((res) => {
      if (!res.data.success) {
        throw new Error(res.data)
      }

      const symbols = res.data.result

      for (let i = 0; i < symbols.length; i++) {
        let symbol = symbols[i]

        if (!symbol.IsActive) {
          continue
        }

        availableSymbols.push({
          baseAsset: symbol.BaseCurrency,
          quoteAsset: symbol.MarketCurrency,
          symbol: symbol.MarketName
        })
      }

      return availableSymbols
    })
    .then((availableSymbols) => {
      const filepath = path.join(__dirname, 'symbols.json')
      const filedata = JSON.stringify(availableSymbols, null, 2)
      fs.writeFile(filepath, filedata, (err) => {
        if (err) throw err

        console.log(chalk.green('successfully updated bittrex symbols'))
      })

      return availableSymbols
    })
}

// Bittrex.downloadSymbols()
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2))
//   })
//   .catch((err) => { console.error(chalk.red(err)) })

Bittrex.load = () => {
  return availableSymbols
}

module.exports = Bittrex
