export class AccountDetailsDto {
    constructor({ AccountNumber, BankHolderName, BankName, BranchName }) {
      this.AccountNumber = AccountNumber;
      this.BankHolderName = BankHolderName;
      this.BankName = BankName;
      this.BranchName = BranchName;
    }
  }
  