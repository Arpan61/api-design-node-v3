import { resolveConfig } from 'prettier'

export const getOne = model => async (req, res) => {
  const id = req.params.id
  const userId = req.user._id

  const doc = await model.findOne({ _id: id, createdBy: userId })

  if (!doc) {
    return res.status(400).end()
  }
  res.status(200).json({ data: doc })
}

export const getMany = model => async (req, res) => {
  const userId = req.user._id

  const docs = await model.find({ createdBy: userId })
  res.status(200).json({ data: docs })
}

export const createOne = model => async (req, res) => {
  const userId = req.user._id

  const docs = await model.create({ ...req.body, createdBy: userId })
  res.status(201).json({ data: docs })
}

export const updateOne = model => async (req, res) => {
  const id = req.params.id
  const userId = req.user._id

  const doc = await model.findOneAndUpdate(
    { _id: id, createdBy: userId },
    req.body,
    { new: true }
  )

  if (!doc) {
    return res.status(400).end()
  }

  res.status(200).json({ data: doc })
}

export const removeOne = model => async (req, res) => {
  const doc = await model
    .findOneAndRemove({
      _id: req.params.id,
      createdBy: req.user._id
    })
    .exec()

  if (!doc) {
    return res.status(400).end()
  }
  res.status(200).json({ data: doc })
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})
