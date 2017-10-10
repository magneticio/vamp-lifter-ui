import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatListModule, MatProgressBarModule,
  MatSidenavModule, MatSnackBarModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LifterComponent} from './lifter.component';
import {ConnectionsComponent} from './connections/connections.component';
import {SetupComponent} from './setup/setup.component';
import {
  ConfigurationComponent, ConfigurationConfirmationDialogComponent,
  SaveConfigurationGuard
} from './configuration/configuration.component';
import {AceEditorModule} from 'ng2-ace-editor';
import {HttpClientModule} from '@angular/common/http';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {ToolbarService} from './toolbar/toolbar.service';
import {InfoComponent} from './info/info.component';

const routes: Routes = [
  {
    path: 'configuration',
    component: ConfigurationComponent,
    canDeactivate: [SaveConfigurationGuard]
  },
  {
    path: 'connections',
    component: ConnectionsComponent
  },
  {
    path: 'setup',
    component: SetupComponent
  },
  {
    path: 'info',
    component: InfoComponent
  },
  {
    path: '**',
    redirectTo: 'configuration'
  }
];

@NgModule({
  declarations: [
    LifterComponent,
    ConnectionsComponent,
    SetupComponent,
    InfoComponent,
    ConfigurationComponent,
    ToolbarComponent,
    ConfigurationConfirmationDialogComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    AceEditorModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ToolbarService, SaveConfigurationGuard],
  bootstrap: [LifterComponent],
  entryComponents: [ConfigurationConfirmationDialogComponent]
})
export class LifterModule {
}
