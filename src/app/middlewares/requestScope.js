export function meScope(req, res, next) {
  req.container.register({
    isMe: asValue(true),
  });
  next();
};

export function otherUserScope(req, res, next) {
  req.container.register({
    isMe: asValue(false),
  });
  next();
};
