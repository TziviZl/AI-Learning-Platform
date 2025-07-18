class AppError extends Error {
  statusCode: number;
  status: string;     
  isOperational: boolean; 
  details?: any;    

  constructor(message: string, statusCode: number, details?: any) {
    super(message); 

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details; // Assign any additional details

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
