exports.handle404s = (req, res) => {
    res.status(404).send({ msg: 'Route not found'});
  };

exports.handleCustomErrors = (err, req, res, next) =>{
  if(err.msg && err.status){
    res.status(err.status).send({msg: err.msg})
  }else{
    next(err);
  }
}

exports.handle400s = (err, req, res, next) =>{
  if(err.code === "22P02"){
    res.status(400).send({msg: "Invalid ID given"});
  }else{
    next(err);
  }
}