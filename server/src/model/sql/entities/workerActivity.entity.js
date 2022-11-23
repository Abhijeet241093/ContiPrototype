import BaseModelEntity from "./baseModel.entity.js";
import ProjectEntity   from './project.entity.js'
import UserEntity   from './user.entity.js'
import ActivityEntity   from './activity.entity.js'
import { Model } from 'objection'
class WorkerActivityEntity extends BaseModelEntity {
    static get tableName() {
        return "WorkerActivity";
    }

    static get relationMappings() { 
        return {
          user: {
            relation: Model.BelongsToOneRelation,   
            modelClass: UserEntity,
            join: {
              from: 'WorkerActivity.userId',
              to: 'User.id',
            },
          },
          activity: {
            relation: Model.BelongsToOneRelation,   
            modelClass: ActivityEntity,
            join: {
              from: 'WorkerActivity.activityId',
              to: 'Activity.id',
            },
          }
        }
      }
}

export default WorkerActivityEntity;
