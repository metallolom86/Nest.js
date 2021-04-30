import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import debugModule from 'debug';

const debug = debugModule('debug');

/**
 * Setup common fields that are available on every model
 * options:
 * prefix:  [id prefix, i.e, 'prf']
 */

export default function commonFieldsPlugin(schema, options) {
  // schema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

  schema.add({
    _id: {
      type: String,
      default: function genId() {
        return options.prefix + uuidv4();
      },
    },

    createdAt: Date,
    updatedAt: Date,
  });

  async function cascade() {
    const schemaObj = this.schema.obj;
    for (const field in schemaObj) {
      let model;
      const fieldProps =
        Array.isArray(schemaObj[field]) && schemaObj[field].length
          ? schemaObj[field][0]
          : schemaObj[field];
      if (fieldProps.ref) {
        model = mongoose.model(fieldProps.ref);
      } else if (fieldProps.refPath) {
        const refPath = fieldProps.refPath;
        model = mongoose.model(this[refPath]);
      }
      if (model) {
        const fieldValue = this[field];
        if (Array.isArray(fieldValue) && fieldValue.length) {
          fieldValue.map(async (id) => {
            const item = await model.findById(id);
            debug('cascade delete:', item && item._id);
            if (item) {
              item.delete();
            }
          });
        } else {
          const item = await model.findById(fieldValue);
          debug('cascade delete:', item && item._id);
          if (item) {
            item.delete();
          }
        }
      }
    }
  }

  schema.index({ created: -1 });

  schema.pre('save', async function () {
    const now = new Date();
    this.updatedAt = now;

    if (!this.createdAt) {
      this.createdAt = now;
    }
    if (this.deleted && options.cascadeEnable) {
      await cascade.call(this);
    }
  });

  schema.pre('update', async function () {
    this.update({ $set: { updated: Date.now() } });
  });
}
