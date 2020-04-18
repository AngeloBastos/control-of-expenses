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

const addTransictionIntoDOM = ({ id, name, amount }) => {
  const operator = amount < 0 ? '-': '+'
  const CSSClass = amount < 0 ? 'minus': 'plus'
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement('li')

  li.classList.add(CSSClass)
  li.innerHTML = `
    ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTrasaction(${id})">x</button>
  `
  transactionsUl.prepend(li)
}

const getTotal = transactionAmounts => transactionAmounts
  .reduce((accumulator, transaction) => accumulator + transaction, 0)
  .toFixed(2)

const getIncomes = transactionAmounts => transactionAmounts
  .filter(value => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2)

const getExpenses = transactionAmounts => Math.abs(transactionAmounts
  .filter(value => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2)

const updateBalanceValues = () => {
  const transactionAmounts = transactions.map(({ amount }) => amount)
  const total = getTotal(transactionAmounts)
  const income = getIncomes(transactionAmounts)
  const expense = getExpenses(transactionAmounts)

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

const addToTransactionArray = ({transactionName, transactionAmount}) => {
  transactions.push({
    id: genarateID(),
    name: transactionName,
    amount: +transactionAmount 
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
}


const handleFormSubmit = event => {
  event.preventDefault()
  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

  if (isSomeInputEmpty) {
    alert('Por favor, preencha tanto o nome quanto o valor da trasação')
    return
  }

  addToTransactionArray({transactionName, transactionAmount})
  init()
  updateLocalStorage()
  cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)