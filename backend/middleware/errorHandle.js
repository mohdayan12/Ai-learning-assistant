const errorHandler=(err,req,res,next)=>{
    let statusCode=err.statusCode || 500;
    let message=err.message || 'Internal Server Error';

    if(err.name==='CastErrrr'){
       message='Resource not found';
       statusCode=400;
    }

    if(err.code=== 1100){
      const filed=Object.keys(err.keyValue)[0];
      message=`${filed} already exists`;
      statusCode=400;  
    }

    if(err.name==='ValidationError'){
     message=Object.values(err.errors).map(value=>value.message).join(', ');
     statusCode=400;
    }

    if(err.code==='LIMIT_FILE_SIZE'){
     message='File size is exceeeds the maximum limit of 10MB ';
     statusCode=400;
    }

    if(err.name==='JsonWebTokenError'){
       message='Invalid token';
       statusCode=401;
    }

    if(err.name==='TokenExpiredError'){
     message='Token has expired';
     statusCode=401;
    }

    console.error('Error:',{
       message:err.message,
       stack:process.env.NODE_ENV==='development'?err.stack:undefined
    });

    res.status(statusCode).json({
       success:false,
       error:message,
       statusCode,
       ...(process.env.NODE_ENV==='development' && {stack:err.stack})
    });
};
export default errorHandler;