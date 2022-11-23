import BaseModelEntity from "./baseModel.entity.js";
import ProjectEntity   from './project.entity.js'
import UserEntity   from './user.entity.js'
import ActivityEntity   from './activity.entity.js'
import { Model } from 'objection'
class SafetyReportEntity extends BaseModelEntity {
    static get tableName() {
        return "SafetyReport";
    }

    static get relationMappings() { 
        return {
          user: {
            relation: Model.BelongsToOneRelation,   
            modelClass: UserEntity,
            join: {
              from: 'SafetyReport.userId',
              to: 'User.id',
            },
          },
          project: {
            relation: Model.BelongsToOneRelation,   
            modelClass: ProjectEntity,
            join: {
              from: 'SafetyReport.projectId',
              to: 'Project.id',
            },
          }
        }
      }
}

export default SafetyReportEntity;
