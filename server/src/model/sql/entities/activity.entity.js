import BaseModelEntity from "./baseModel.entity.js";
class ActivityEntity extends BaseModelEntity {
    static get tableName() {
        return "Activity";
    }
}

export default ActivityEntity;
