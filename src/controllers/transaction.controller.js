const mongoose = require('mongoose');
const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require('../services/email.service');
const accountModel = require('../models/account.model');

async function createTransaction(req, res) {
    try {
        const { fromaccount, toaccount, amount, idempotencykey } = req.body;

        if (!fromaccount || !toaccount || !amount || !idempotencykey) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const fromUserAccount = await accountModel.findById(fromaccount);
        const toUserAccount = await accountModel.findById(toaccount);

        if (!fromUserAccount || !toUserAccount) {
            return res.status(400).json({ message: "Invalid accounts" });
        }

        const existingTx = await transactionModel.findOne({ idempotencyKey: idempotencykey });

        if (existingTx) {
            if (existingTx.status === "COMPLETED") {
                return res.status(200).json({ message: "Already processed", transaction: existingTx });
            }
            if (existingTx.status === "PENDING") {
                return res.status(200).json({ message: "Still processing" });
            }
            if (["FAILED", "REVERSED"].includes(existingTx.status)) {
                return res.status(400).json({ message: "Retry transaction" });
            }
        }

        if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
            return res.status(400).json({ message: "Accounts must be ACTIVE" });
        }

        const balance = await fromUserAccount.getBalance();

        if (balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        let transaction;

        try {
            transaction = (await transactionModel.create([{
                fromAccount: fromaccount,
                toAccount: toaccount,
                amount,
                idempotencyKey: idempotencykey,
                status: "PENDING"
            }], { session }))[0];

            await ledgerModel.create([{
                account: fromaccount,
                amount,
                transaction: transaction._id,
                type: "DEBIT"
            }], { session });

            await ledgerModel.create([{
                account: toaccount,
                amount,
                transaction: transaction._id,
                type: "CREDIT"
            }], { session });

            await transactionModel.findByIdAndUpdate(
                transaction._id,
                { status: "COMPLETED" },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }

        await emailService.sendTransactionEmail(
            req.user.email,
            req.user.name,
            amount,
            toaccount
        );

        return res.status(201).json({
            message: "Transaction successful",
            transaction
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}