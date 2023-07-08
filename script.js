'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  loan: false,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  loan: false,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  loan: false,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  loan: false,
};

const accounts = [account1, account2, account3, account4];
console.log(accounts);
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelCurrency = document.querySelector('.currency');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Creating function to display transactions .

const displayMovements = function (account, sort = false) {
  // Setting the element empty
  containerMovements.innerHTML = '';
  // Sorting Condition | Arrange movements in decending order
  // We need to sort the data in the acending order , because data is displayed into the DOM 'afterbegin'
  // the specified element tag
  const msort = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  msort.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // Creating HTML template element
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}<span class="currency">${(labelCurrency.textContent =
      '€')}</span></div>
      </div>`;

    // The insertAdjacentHTML() method of the Element interface parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position.
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Claculating current balance

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (acc, cur) => (cur > 0 ? cur + acc : acc - Math.abs(cur)),
    0
  );
  return `${account.balance.toFixed(2)} ${(labelCurrency.textContent = '€')}`;
};

// Display Calculate Summary of Transactions

const displayCalcSummary = function (account) {
  // Income
  const income = account.movements
    .filter(cur => cur > 0)
    .reduce((acc, cur) => acc + cur, 0);
  // Outcome
  const outcome = account.movements
    .filter(cur => cur < 0)
    .reduce((acc, cur) => acc + Math.abs(cur), 0);
  // Interest
  const interest = account.movements
    .filter(current => current > 0)
    .map(current => (current * this.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, current) => acc + current, 0);

  // Resetting HTML element text
  labelSumIn.textContent = `${income.toFixed(2)} ${(labelCurrency.textContent =
    '€')}`;
  labelSumOut.textContent = `${outcome.toFixed(
    2
  )} ${(labelCurrency.textContent = '€')}`;
  labelSumInterest.textContent = `${interest.toFixed(
    2
  )} ${(labelCurrency.textContent = '€')}`;
};

// Update UI function
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc);
  // Display Balance
  labelBalance.textContent = calcDisplayBalance(acc);
  // Display Summary
  displayCalcSummary.call(acc, acc);

  // resetting the input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputTransferTo.value = inputTransferAmount.value = '';

  // Remove focus of element
  inputLoginPin.blur();
  inputTransferAmount.blur();
  inputTransferTo.blur();
};

// Cumputing Username of User

const createUsername = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .split(' ')
      .map(nm => nm[0].toLowerCase().slice(0))
      .join('');
  });
};
createUsername(accounts);

const account = accounts.find(account => account.owner === 'Jessica Davis');
console.log(account);

// LOGIN check
// LoginButton Even Handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent Form from submiting
  e.preventDefault();
  try {
    currentAccount = accounts.find(
      account => account.username === inputLoginUsername.value
    ); // inputLoginUsername.value
    if (currentAccount.pin === Number(inputLoginPin.value)) {
      // LoginputinPin.value
      // Display UI and Wellcome message
      labelWelcome.textContent = `Wellcome, ${
        currentAccount.owner.split(' ')[0]
      }`;
      containerApp.style.opacity = 100; // to display the UI

      // // setting up input fields to empty string
      // inputLoginUsername.value = inputLoginPin.value ='';
      // inputLoginPin.blur(); // to remove focus on the element

      // Update UI
      updateUI(currentAccount);
    }
  } catch {
    console.log('LOGIN unsuccessfull');
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();
  }
});

// Transfer Money Event Listner
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // Fetching the amount value
  const amount = Number(inputTransferAmount.value);
  // Fetching the receiver name
  const receiver = accounts.find(
    account => account.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiver &&
    receiver?.username !== currentAccount.username
  ) {
    //  Doing transactions
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    updateUI(currentAccount);
  }
  // inputTransferTo.value = inputTransferAmount.value = '';
  // inputTransferAmount.blur();
  // inputTransferTo.blur();
  else {
    console.log('Please enter corrent username or pin');
  }
});

// Loan Request
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  // The loan is only granted if there is any deposit that's greater or equal 10% of the requested amount of loan.
  if (
    !currentAccount.loan &&
    loanAmount > 0 &&
    currentAccount.movements.some(amount => amount >= loanAmount * 0.1)
  ) {
    // Add the positive loanAmount to the currentUser movement
    currentAccount.movements.push(loanAmount);
    // Update Loan status
    currentAccount.loan = true;
    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});
// Closing account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // Validating input with current user
  if (
    (currentAccount.username === inputCloseUsername.value) &
    (currentAccount.pin === Number(inputClosePin.value))
  ) {
    accounts.splice(
      accounts.findIndex(
        account =>
          (account.username === currentAccount.username) &
          (account.pin === currentAccount.pin)
      ),
      1
    );
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
    labelWelcome.textContent = 'Log in to get started';
  } else {
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();
    console.log('Cancel');
  }
  console.log(accounts);
});

// Calculate Overall bank balance ao all accounts

const calcOverallBalance = function (acc) {
  const totalBalance = acc
    .map(account => account.movements)
    .flat()
    .reduce((acc, cur) => acc + cur);
  console.log(totalBalance);
};
calcOverallBalance(accounts);

// Create sort event handler
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Use of Array.from() method in the Real application

// We have to fetch the movements details of current user when user click on balance label and calculate its sum ?

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    elm => Number(elm.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});
