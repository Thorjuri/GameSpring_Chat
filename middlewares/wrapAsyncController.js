const wrapAsyncController = (fn) => {  //예외처리 여부 관계없이 모든 error wrapping, 일관 반환
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
module.exports = wrapAsyncController;