import BaseModelEntity from "./baseModel.entity.js";
class ProjectEntity extends BaseModelEntity {
    static get tableName() {
        return "Project";
    }
}

export default ProjectEntity;
