import BaseModelEntity from "./baseModel.entity.js";
import ProjectEntity   from './project.entity.js'
import UserEntity   from './user.entity.js'
import ActivityEntity   from './activity.entity.js'
import { Model } from 'objection'
class ProjectRequestEntity extends BaseModelEntity {
    static get tableName() {
        return "ProjectRequest";
    }

    static get relationMappings() { 
        return {
          user: {
            relation: Model.BelongsToOneRelation,   
            modelClass: UserEntity,
            join: {
              from: 'ProjectRequest.userId',
              to: 'User.id',
            },
          },
          activity: {
            relation: Model.BelongsToOneRelation,   
            modelClass: ActivityEntity,
            join: {
              from: 'ProjectRequest.activityId',
              to: 'Activity.id',
            },
          },
          project: {
            relation: Model.BelongsToOneRelation,   
            modelClass: ProjectEntity,
            join: {
              from: 'ProjectRequest.projectId',
              to: 'Project.id',
            },
          }
        }
      }
}

export default ProjectRequestEntity;
