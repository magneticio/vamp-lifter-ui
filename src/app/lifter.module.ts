import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdListModule, MdProgressBarModule,
  MdSidenavModule, MdSnackBarModule, MdToolbarModule, MdTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LifterComponent} from './lifter.component';
import {ConnectionsComponent} from './connections/connections.component';
import {SetupComponent} from './setup/setup.component';
import {ConfigurationComponent, ConfigurationUpdateDialogComponent} from './configuration/configuration.component';
import {AceEditorModule} from 'ng2-ace-editor';
import {HttpClientModule} from '@angular/common/http';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {ToolbarService} from './toolbar/toolbar.service';
import {InfoComponent} from './info/info.component';

const routes: Routes = [
  {path: 'configuration', component: ConfigurationComponent},
  {path: 'connections', component: ConnectionsComponent},
  {path: 'setup', component: SetupComponent},
  {path: 'info', component: InfoComponent},
  {path: '**', redirectTo: 'configuration'}
];

@NgModule({
  declarations: [
    LifterComponent,
    ConnectionsComponent,
    SetupComponent,
    InfoComponent,
    ConfigurationComponent,
    ToolbarComponent,
    ConfigurationUpdateDialogComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    AceEditorModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdIconModule,
    MdToolbarModule,
    MdSidenavModule,
    MdListModule,
    MdProgressBarModule,
    MdTooltipModule,
    MdDialogModule,
    MdSnackBarModule,
    MdCardModule,
    MdCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ToolbarService],
  bootstrap: [LifterComponent],
  entryComponents: [ConfigurationUpdateDialogComponent]
})
export class LifterModule {
}
