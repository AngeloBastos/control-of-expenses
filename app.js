const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenceDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransaction = JSON.parse(localStorage
  .getItem('transaction'))
let transactions = localStorage
.getItem('transaction') !== null ? localStorageTransaction : []

const removeTrasaction = ID => {
  transactions = transactions.filter(transaction =>
    transaction.id !== ID)
  updateLocalStorage()
  init()
} 

const addTransictionIntoDOM = transaction => {
  const operator = transaction.amount < 0 ? '-': '+'
  const CSSClass = transaction.amount < 0 ? 'minus': 'plus'
  const amountWithoutOperator = Math.abs(transaction.amount)
  const li = document.createElement('li')

  li.classList.add(CSSClass)
  li.innerHTML = `
    ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTrasaction(${transaction.id})">x</button>
  `
  transactionsUl.prepend(li)
}

const updateBalanceValues = () => {
  const transactionAmounts = transactions
    .map(transaction => transaction.amount)
  const total = transactionAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)
  const income = transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)
  const expense = Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `+ R$ ${income}`
  expenceDisplay.textContent = `- R$ ${expense}`
}

const init = () => {
  transactionsUl.innerHTML = ''
  transactions.forEach(addTransictionIntoDOM)
  updateBalanceValues()
}

init()

const updateLocalStorage = () => {
  localStorage.setItem('transaction', JSON.stringify(transactions))
}

const genarateID = () => Math.round(Math.random() * 1000)

form.addEventListener('submit', event => {
  event.preventDefault()
  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  if (transactionName === '' || transactionAmount === '') {
    alert('Por favor, preencha tanto o nome quanto o valor da trasação')
    return
  }

  const transaction = {
    id: genarateID(),
    name: transactionName,
    amount: +transactionAmount 
  }

  transactions.push(transaction)
  init()
  updateLocalStorage()
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
})