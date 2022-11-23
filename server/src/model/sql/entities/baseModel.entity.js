import { Model } from 'objection';
class BaseModelEntity extends Model {
  static get idColumn() {
    return 'id';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static async FindAsyncById(id) {
    return await this.GetQuery().findById(id);
  }

  static async addAsync(obj) {
    if (obj != null) {
      return await this.query().insert(obj);
    }
    return null;
  }

  static async updateAsync(id, obj) {
    await this.query().findById(id).patch(obj);
  }
  static async DeleteRangeAsyncByIds(ids) {
    return await this.query().patch({ delete: true }).whereIn('id', ids);
  }

  static async DeleteAsyncByIs(id) {
    return await this.query().patch({ delete: true }).where('id', id);
  }

  static GetQuery() {
    return this.query().where({ delete: null });
  }

  static async addGeneral(obj) {
    return await this.query().insert(obj);
  }
}

export default BaseModelEntity 