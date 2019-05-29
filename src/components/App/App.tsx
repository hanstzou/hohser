import { Domain, DisplayStyle, Color } from 'src/types';
import * as React from 'react';
// import AddDomain from '../AddDomain/AddDomain';
import { CssBaseline } from '@material-ui/core';

import TopBar from '../TopBar/TopBar';
import BottomBar from '../BottomBar/BottomBar';
import DomainsList from '../DomainsList/DomainsList';
import EditDomain from '../EditDomain/EditDomain';
import Drawer from '../SideMenu/Drawer';
import SnackBar from './SnackBar';
import SearchBox from '../SearchBox/SearchBox';

export interface Props {
  domainsList: Array<Domain>;
  domainsListLoading: boolean;
  options: any;
  addDomain: (domainName: string, display: DisplayStyle, color?: Color) => void;
  editDomain: (index: number, domainName: string, display: DisplayStyle, color?: Color) => void;
  removeDomain: (index: number) => void;
  clearDomainList: () => void;
  importDomains: (domainsList: Domain[]) => void;
  fetchDomainsList: () => void;
  fetchOptions: () => void;
  toggleShowAll: () => void;
  importFromOldVersion: () => void;
}

interface State {
  editedDomain: number | null;
  drawerIsOpen: boolean;
  searchIsOpen: boolean;
  searchedPhrase: string;
}

class App extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = {
      editedDomain: null,
      drawerIsOpen: false,
      searchIsOpen: false,
      searchedPhrase: ''
    };
    this.handleOnChangeSearchTextField = this.handleOnChangeSearchTextField.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }

  componentDidMount () {
    this.props.fetchDomainsList();
    this.props.fetchOptions();
  }

  componentWillUpdate (nextProps: Props) {
    if (this.props.domainsListLoading && !nextProps.domainsListLoading) {
      this.props.importFromOldVersion();
    }
  }

  removeDomainHandle (index: number) {
    this.props.removeDomain(index);
  }

  editDomainHandle (index: number) {
    this.setState({editedDomain: index});
  }

  closeEditionHandle () {
    this.setState({editedDomain: null});
  }

  toggleDrawer () {
    this.setState({
      drawerIsOpen: !this.state.drawerIsOpen
    });
  }

  public toggleSearch (): void {
    this.setState({
      searchIsOpen: !this.state.searchIsOpen
    });
  }

  public toggleShowAll (): void {
    this.props.toggleShowAll();
  }

  public handleOnChangeSearchTextField (e: any): void {
    this.setState({searchedPhrase: e.target.value});
  }

  public render () {
    return [
      <CssBaseline />,
      <TopBar
        toggleDrawer={() => this.toggleDrawer()}
        toggleSearch={this.toggleSearch}
      />,
      <SnackBar
        options={this.props.options}
        toggleShowAll={() => this.toggleShowAll()}
      />,
      <Drawer
        open={this.state.drawerIsOpen}
        toggle={() => this.toggleDrawer()}
        toggleShowAll={() => this.toggleShowAll()}
        options={this.props.options}
        addDomain={this.props.addDomain}
        clearDomainList={this.props.clearDomainList}
        domainsList={this.props.domainsList}
        importDomains={this.props.importDomains}
      />,
      <SearchBox
        open={this.state.searchIsOpen}
        toggle={() => this.toggleSearch()}
        onChangeSearchTextField={this.handleOnChangeSearchTextField}
        value={this.state.searchedPhrase}
      />,
      <DomainsList
        domainsList={this.props.domainsList}
        removeDomainHandle={(i) => this.removeDomainHandle(i)}
        editDomainHandle={(i) => this.editDomainHandle(i)}
        searchedPhrase={this.state.searchedPhrase}
      />,
      <EditDomain
        open={this.state.editedDomain}
        closeEditionHandle={() => this.closeEditionHandle()}
        domain={this.state.editedDomain !== null ? this.props.domainsList[this.state.editedDomain] : null}
        editDomain={(index: number, domainName: string, display: DisplayStyle, color?: Color) => this.props.editDomain(index, domainName, display, color)}
      />,
      <BottomBar addDomain={this.props.addDomain} />
    ];
  }
}

export default App;
