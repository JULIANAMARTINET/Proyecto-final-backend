import mongoose from "mongoose";

class MongoDBContainer {
  constructor({ name, schema }) {
    this.model = mongoose.model(name, schema);
  }

  async getAll() {
    try {
      const response = await this.model.find();
      return response;
    } catch (error) {
      return error;
    }
  }

  async save(element) {
    try {
      console.log("elements", element);
      console.log("model", this.model);
      const response = await this.model.create(element);
      console.log("response", response);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getById(id) {
    try {
      const response = await this.model.findById(id);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getOne(options) {
    try {
      const response = await this.model.findOne(options).lean().exec();
      return response;
    } catch (error) {
      return error;
    }
  }

  async updateById(id, newData) {
    try {
      const response = await this.model.findByIdAndUpdate(id, newData, {
        new: true,
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async deleteById(id) {
    try {
      const response = await this.model.findByIdAndDelete(id);
      return response;
    } catch (error) {
      return error;
    }
  }
}

export { MongoDBContainer };
