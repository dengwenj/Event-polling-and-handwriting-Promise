class Dwj {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  constructor(executor) {
    this.status = Dwj.PENDING
    this.result = null
    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }

  resolve(value) {
    if (this.status === Dwj.PENDING) {
      this.status = Dwj.FULFILLED
      this.result = value
    }
  }

  reject(error) {
    if (this.status === Dwj.PENDING) {
      this.status = Dwj.REJECTED
      this.result = error
    }
  }
}
