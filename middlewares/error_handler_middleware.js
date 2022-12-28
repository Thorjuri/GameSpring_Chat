module.exports = (err, req, res, next)=> {
    console.log(err);
    if (err.status === undefined) {
        res.status(500).json({  // 예외처리 되지 않은 에러 반환
            name: err.name,
            status: 500,
            errorMessage: err.message,
            Request: {
                header: req.headers,
                params: req.params,
                body: req.body,
            },
            errorStack: err.stack,
        });
    }else{
        res.status(err.status).json({  // 예외처리 된 에러 반환
            type: err.name,
            status: err.status,
            error: err.message,
        });
    };
};
