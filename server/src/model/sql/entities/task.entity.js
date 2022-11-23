import BaseModelEntity from "./baseModel.entity.js";
import ProjectEntity   from './project.entity.js'
import UserEntity   from './user.entity.js'
import ActivityEntity   from './activity.entity.js'
import { Model } from 'objection'
class TaskEntity extends BaseModelEntity {
    static get tableName() {
        return "Task";
    }

    static get relationMappings() { 
        return {
          user: {
            relation: Model.BelongsToOneRelation,   
            modelClass: UserEntity,
            join: {
              from: 'Task.userId',
              to: 'User.id',
            },
          },
          activity: {
            relation: Model.BelongsToOneRelation,   
            modelClass: ActivityEntity,
            join: {
              from: 'Task.activityId',
              to: 'Activity.id',
            },
          },
          project: {
            relation: Model.BelongsToOneRelation,   
            modelClass: ProjectEntity,
            join: {
              from: 'Task.projectId',
              to: 'Project.id',
            },
          }
        }
      }
}

export default TaskEntity;
