import { ApplicationRef, Component, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityFormComponent } from 'app/pages/common/entity/entity-form';
import { Observable } from 'rxjs';

import {
  IdmapService, IscsiService, RestService, WebSocketService,
} from 'app/services';
import { FieldConfig } from '../../../common/entity/entity-form/models/field-config.interface';
import { FieldSet } from 'app/pages/common/entity/entity-form/models/fieldset.interface';
import helptext from 'app/helptext/services/components/service-snmp';
import { FormConfiguration } from 'app/interfaces/entity-form.interface';

@Component({
  selector: 'snmp-edit',
  template: ' <entity-form [conf]="this"></entity-form>',
  providers: [IscsiService, IdmapService],
})

export class ServiceSNMPComponent implements FormConfiguration {
  updateCall = 'snmp.update';
  queryCall: 'snmp.config' = 'snmp.config';
  route_success: string[] = ['services'];
  title = helptext.formTitle;
  fieldConfig: FieldConfig[] = [];
  fieldSets: FieldSet[] = [
    {
      name: helptext.general_title,
      width: '100%',
      label: true,
      config: [
        {
          type: 'input',
          name: 'location',
          placeholder: helptext.location_placeholder,
          tooltip: helptext.location_tooltip,
          label: helptext.location_label,
          validation: helptext.location_validation,
        },
        {
          type: 'input',
          name: 'contact',
          placeholder: helptext.contact_placeholder,
          tooltip: helptext.contact_tooltip,
          validation: helptext.contact_validation,
        },
        {
          type: 'input',
          name: 'community',
          placeholder: helptext.community_placeholder,
          tooltip: helptext.community_tooltip,
          validation: helptext.community_validation,
        }],
    },
    {
      name: helptext.v3_title,
      width: '100%',
      label: true,
      config: [
        {
          type: 'checkbox',
          name: 'v3',
          placeholder: helptext.v3_placeholder,
          tooltip: helptext.v3_tooltip,
        },
        {
          type: 'input',
          name: 'v3_username',
          placeholder: helptext.v3_username_placeholder,
          tooltip: helptext.v3_username_tooltip,
          relation: helptext.v3_username_relation,
        },
        {
          type: 'select',
          name: 'v3_authtype',
          placeholder: helptext.v3_authtype_placeholder,
          tooltip: helptext.v3_authtype_tooltip,
          options: helptext.v3_authtype_options,
          relation: helptext.v3_authtype_relation,
        },
        {
          type: 'input',
          name: 'v3_password',
          inputType: 'password',
          placeholder: helptext.v3_password_placeholder,
          togglePw: true,
          tooltip: helptext.v3_password_tooltip,
          validation: helptext.v3_password_validation,
          relation: helptext.v3_password_relation,
        },
        {
          type: 'select',
          name: 'v3_privproto',
          placeholder: helptext.v3_privproto_placeholder,
          tooltip: helptext.v3_privproto_tooltip,
          options: helptext.v3_privproto_options,
          relation: helptext.v3_privproto_relation,
        },
        {
          type: 'input',
          name: 'v3_privpassphrase',
          inputType: 'password',
          togglePw: true,
          placeholder: helptext.v3_privpassphrase_placeholder,
          tooltip: helptext.v3_privpassphrase_tooltip,
          validation: helptext.v3_privpassphrase_validation,
          relation: helptext.v3_privpassphrase_relation,
        }],
    },
    {
      name: helptext.other_title,
      width: '100%',
      label: true,
      config: [
        {
          type: 'textarea',
          name: 'options',
          placeholder: helptext.options_placeholder,
          tooltip: helptext.options_tooltip,
        },
        {
          type: 'checkbox',
          name: 'zilstat',
          placeholder: helptext.zilstat_placeholder,
          tooltip: helptext.zilstat_tooltip,
        },
        {
          type: 'select',
          name: 'loglevel',
          placeholder: helptext.loglevel_placeholder,
          tooltip: helptext.loglevel_tooltip,
          options: helptext.loglevel_options,
        },
        {
          type: 'checkbox',
          name: 'iftop',
          placeholder: helptext.iftop.placeholder,
          tooltip: helptext.iftop.tooltip,
          value: false,
        },
      ],
    },
    { name: 'divider', divider: true },
  ];

  constructor(protected router: Router, protected route: ActivatedRoute,
    protected rest: RestService, protected ws: WebSocketService,
    protected _injector: Injector, protected _appRef: ApplicationRef,
    protected iscsiService: IscsiService,
    protected idmapService: IdmapService) {}

  afterInit(entityForm: EntityFormComponent): void {
    entityForm.submitFunction = this.submitFunction;
  }

  resourceTransformIncomingRestData(data: any): any {
    delete data['v3_privpassphrase'];
    delete data['v3_password'];
    return data;
  }

  clean(value: any): any {
    if (!value['v3']) {
      value['v3_password'] = '';
      value['v3_privpassphrase'] = '';
      value['v3_privproto'] = null;
      value['v3_authtype'] = '';
    }

    return value;
  }

  submitFunction(this: any, entityForm: any): Observable<any> {
    return this.ws.call('snmp.update', [entityForm]);
  }
}
