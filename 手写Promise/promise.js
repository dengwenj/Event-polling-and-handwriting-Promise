class Dwj {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  constructor(ex) {
    this.status = Dwj.PENDING
    this.result = null
    ex(this.resolve.bind(this), this.reject.bind(this))
  }

  resolve(value) {
    this.status = Dwj.FULFILLED
    this.result = value
  }

  reject(error) {
    this.status = Dwj.REJECTED
    this.result = error
  }
}
