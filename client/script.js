document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.content-area');
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    const balanceAmountEl = document.querySelector('.balance-amount');

    // --- MOCK DATA ---
    const mockBanks = [
        { id: 1, name: 'Equity Bank', accountNumber: '**** **** **** 1234', balance: 150000 },
        { id: 2, name: 'KCB Bank', accountNumber: '**** **** **** 5678', balance: 25500 },
        { id: 3, name: 'M-PESA', accountNumber: '**** **** **** 7890', balance: 5200 },
    ];

    const mockCards = [
        { id: 1, network: 'Visa', last4: '4242', cardholder: 'John Doe', expiry: '12/26', balance: 500, label: 'Personal' },
        { id: 2, network: 'Mastercard', last4: '5555', cardholder: 'John Doe', expiry: '08/25', balance: 1250, label: 'Travel Card' },
        { id: 3, network: 'Amex', last4: '0005', cardholder: 'John Doe', expiry: '02/27', balance: 3200, label: 'Business' },
    ];

    const mockTransactions = [
        { id: 'txn_1', description: 'Spotify Subscription', category: 'Entertainment', date: '2024-07-28T14:48:00.000Z', amount: -9.99, currency: 'USD', status: 'Completed' },
        { id: 'txn_2', description: 'Salary Deposit', category: 'Income', date: '2024-07-27T10:30:00.000Z', amount: 3500.00, currency: 'USD', status: 'Completed' },
        { id: 'txn_3', description: 'Transfer to Jane Doe', category: 'Transfers', date: '2024-07-26T18:15:00.000Z', amount: -500.00, currency: 'USD', status: 'Completed' },
        { id: 'txn_4', description: 'Online Purchase - Amazon', category: 'Shopping', date: '2024-07-25T11:05:00.000Z', amount: -78.50, currency: 'USD', status: 'Pending' },
        { id: 'txn_5', description: 'Restaurant - The Bistro', category: 'Food', date: '2024-07-24T20:00:00.000Z', amount: -120.00, currency: 'USD', status: 'Completed' },
        { id: 'txn_6', description: 'ATM Withdrawal', category: 'Cash', date: '2024-07-23T15:20:00.000Z', amount: -200.00, currency: 'USD', status: 'Failed' },
    ];

    const updateTotalBalance = () => {
        const total = mockBanks.reduce((sum, bank) => sum + bank.balance, 0);
        balanceAmountEl.textContent = `${total.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}`;
    };

    // --- RENDER FUNCTIONS ---

    const renderTransactions = (filter = 'all') => {
        let filteredTransactions = mockTransactions;
        if (filter === 'income') {
            filteredTransactions = mockTransactions.filter(txn => txn.amount > 0);
        } else if (filter === 'expense') {
            filteredTransactions = mockTransactions.filter(txn => txn.amount < 0);
        }

        const transactionsHTML = filteredTransactions.map(txn => {
            const isIncome = txn.amount > 0;
            return `
            <tr class="transaction-row">
                <td>
                    <div class="description">${txn.description}</div>
                    <div class="category">${txn.category}</div>
                </td>
                <td>${new Date(txn.date).toLocaleDateString()}</td>
                <td class="amount ${isIncome ? 'income' : 'expense'}">
                    ${isIncome ? '+' : ''}${txn.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
                <td><span class="status-badge status-${txn.status.toLowerCase()}">${txn.status}</span></td>
            </tr>
        `}).join('');

        mainContent.innerHTML = `
            <div class="header">
                <h2>Transactions</h2>
                <div class="filters">
                    <button class="filter-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                    <button class="filter-btn ${filter === 'income' ? 'active' : ''}" data-filter="income">Income</button>
                    <button class="filter-btn ${filter === 'expense' ? 'active' : ''}" data-filter="expense">Expense</button>
                </div>
            </div>
            <div class="transaction-list">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactionsHTML}
                    </tbody>
                </table>
            </div>
        `;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                renderTransactions(btn.dataset.filter);
            });
        });
    };

    const renderMyBanks = () => {
        // ... (existing banks render function)
    };

    const renderMyCards = () => {
        // ... (existing cards render function)
    };

    const renderSendMoney = () => {
        // ... (existing send money render function)
    };

    // --- ROUTING & EVENT LISTENERS ---
    const navigate = (target) => {
        menuLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`[data-target="${target}"]`);
        if (activeLink) activeLink.classList.add('active');

        switch (target) {
            case 'transactions': renderTransactions(); break;
            case 'banks': renderMyBanks(); break;
            case 'cards': renderMyCards(); break;
            case 'send': renderSendMoney(); break;
            default: renderTransactions();
        }
    };

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(link.getAttribute('data-target'));
        });
    });

    // --- INITIAL LOAD ---
    updateTotalBalance();
    navigate('transactions');
});
