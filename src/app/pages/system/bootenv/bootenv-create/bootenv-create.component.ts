import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { helptext_system_bootenv } from 'app/helptext/system/bootenv';
import { EntityFormComponent } from 'app/pages/common/entity/entity-form';
import { Observable } from 'rxjs';
import { BootEnvService, RestService, WebSocketService } from 'app/services';
import { FieldConfig } from '../../../common/entity/entity-form/models/field-config.interface';
import { regexValidator } from '../../../common/entity/entity-form/validators/regex-validation';
import { FormConfiguration } from 'app/interfaces/entity-form.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-bootenv-create',
  template: '<entity-form [conf]="this"></entity-form>',
  providers: [BootEnvService],
})
export class BootEnvironmentCreateComponent implements FormConfiguration {
  route_success: string[] = ['system', 'boot'];
  addCall: 'bootenv.create' = 'bootenv.create';
  pk: any;
  isNew = false;
  isEntity = true;
  protected entityForm: EntityFormComponent;

  fieldConfig: FieldConfig[];

  constructor(protected router: Router, protected route: ActivatedRoute,
    protected rest: RestService, protected ws: WebSocketService, protected bootEnvService: BootEnvService) {}

  preInit(entityForm: EntityFormComponent): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      this.pk = params['pk'];
      this.fieldConfig = [
        {
          type: 'input',
          name: 'name',
          placeholder: helptext_system_bootenv.create_name_placeholder,
          tooltip: helptext_system_bootenv.create_name_tooltip,
          validation: [regexValidator(this.bootEnvService.bootenv_name_regex)],
          required: true,
        },
      ];
    });
    this.entityForm = entityForm;
  }

  afterInit(entityForm: EntityFormComponent): void {
    entityForm.submitFunction = this.submitFunction;
  }

  submitFunction(entityForm: any): Observable<any> {
    const payload: any = {};
    payload['name'] = entityForm.name;
    return this.ws.call('bootenv.create', [payload]);
  }
}
