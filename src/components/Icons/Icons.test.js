
import { shallow } from 'enzyme'
import { AiGenerateIcon } from './AiGenerateIcon'
import { ArrowDownIcon } from './ArrowDownIcon'
import { ArrowDownSolidIcon } from './ArrowDownSolidIcon'
import { ArrowDownToLine } from './ArrowDownToLine'
import { ArrowLeftIcon } from './ArrowLeftIcon'
import { ArrowRotateLeftIcon } from './ArrowRotateLeftIcon'
import { ArrowUpFromLine } from './ArrowUpFromLine'
import { BanIcon } from './BanIcon'
import { BookIcon } from './BookIcon'
import { CalendarXmark } from './CalendarXmark'
import { CaretDownIcon } from './CaretDownIcon'
import { CaretUpIcon } from './CaretUpIcon'
import { ChartPie } from './ChartPieIcon'
import { CheckboxFieldIcon } from './CheckboxFieldIcon'
import { CheckCircleIcon } from './CheckCircleIcon'
import { CheckDouble } from './CheckDouble'
import { CheckIcon } from './CheckIcon'
import { ClipboardIcon } from './ClipboardIcon'
import { CloseCircleIcon } from './CloseCircleIcon'
import { CloudDownloadIcon } from './CloudDownloadIcon'
import { CloudIcon } from './CloudIcon'
import { CommentIcon } from './CommentIcon'
import { CommentPlusIcon } from './CommentPlusIcon'
import { CompressIcon } from './CompressIcon'
import { CopyIcon } from './CopyIcon'
import { DateFieldIcon } from './DateFieldIcon'
import { DeleteIconFilled } from './DeleteIconFilled'
import { DotsVerticalIcon } from './DotsVerticalIcon'
import { DownloadBoldIcon } from './DownloadBoldIcon'
import { EmailsListIcon } from './EmailsListIcon'
import { EnumFieldIcon } from './EnumField'
import { ExclamationCircleOutlinedIcon } from './ExclamationCircleOutlinedIcon'
import { ExpandIcon } from './ExpandIcon'
import { FaCircleCheckIcon } from './FaCircleCheckIcon'
import { FileAltIcon } from './FileAltIcon'
import { FileCodeIcon } from './FileCodeIcon'
import { FileIcon } from './FileIcon'
import { FileImageIcon } from './FileImageIcon'
import { FileJPGIcon } from './FileJPGIcon'
import { FileMailIcon } from './FileMailIcon'
import { FilePDFIcon } from './FilePDFIcon'
import { FolderClosedIcon } from './FolderClosedIcon'
import { GearIcon } from './GearIcon'
import { GoogleDriveIcon } from './GoogleDriveIcon'
import { InfoIcon } from './InfoIcon'
import { KeyValuePairFieldIcon } from './KeyValuePairFieldIcon'
import { LabelIcon } from './LabelIcon'
import { LaptopIcon } from './LaptopIcon'
import { LayerGroupIcon } from './LayerGroupIcon'
import { LeftIcon } from './LeftIcon'
import { LoadingIcon } from './LoadingIcon'
import { MenuOutlinedIcon } from './MenuOutlinedIcon'
import { MessageIcon } from './MessageIcon'
import { MinusOutlinedIcon } from './MinusOutlinedIcon'
import { NewspaperIcon } from './NewspaperIcon'
import { NoteStickyIcon } from './NoteStickyIcon'
import { OpenedEyeIcon } from './OpenedEyeIcon'
import { PaperclipIcon } from './PaperclipIcon'
import { PaperPlaneIcon } from './PaperPlaneIcon'
import { PlusIcon } from './PlusIcon'
import { QuestionCircleIcon } from './QuestionCircleIcon'
import { ResetFiltrationIcon } from './ResetFiltrationIcon'
import { RightIcon } from './RightIcon'
import { RotateLeftIcon } from './RotateLeftIcon'
import { RotateRightIcon } from './RotateRightIcon'
import { ScissorsIcon } from './ScissorsIcon'
import { SearchIcon } from './SearchIcon'
import { SettingsIcon } from './SettingsIcon'
import { ShortLogoIcon } from './ShortLogoIcon'
import { SlashedEyeIcon } from './SlashedEyeIcon'
import { SpinnerIcon } from './SpinnerIcon'
import { StringFieldIcon } from './StringFieldIcon'
import { TableFieldIcon } from './TableFieldIcon'
import { TagIcon } from './TagIcon'
import { UploadIcon } from './UploadIcon'
import { UserIcon } from './UserIcon'
import { WarningIcon } from './WarningIcon'

const Icons = [
  CaretUpIcon,
  CaretDownIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  CommentIcon,
  LayerGroupIcon,
  ArrowDownIcon,
  ExclamationCircleOutlinedIcon,
  FileIcon,
  FileImageIcon,
  FilePDFIcon,
  FileJPGIcon,
  FileMailIcon,
  InfoIcon,
  InfoIcon.Filled,
  LeftIcon,
  LoadingIcon,
  LabelIcon,
  MinusOutlinedIcon,
  PlusIcon,
  QuestionCircleIcon,
  ResetFiltrationIcon,
  RightIcon,
  RotateRightIcon,
  RotateLeftIcon,
  SearchIcon,
  GearIcon,
  UploadIcon,
  UserIcon,
  WarningIcon,
  EmailsListIcon,
  DeleteIconFilled,
  ArrowLeftIcon,
  BookIcon,
  LaptopIcon,
  BanIcon,
  CheckIcon,
  ChartPie,
  GoogleDriveIcon,
  KeyValuePairFieldIcon,
  CheckboxFieldIcon,
  DateFieldIcon,
  EnumFieldIcon,
  OpenedEyeIcon,
  SlashedEyeIcon,
  StringFieldIcon,
  TableFieldIcon,
  ArrowDownSolidIcon,
  ArrowRotateLeftIcon,
  SpinnerIcon,
  TagIcon,
  ShortLogoIcon,
  PaperPlaneIcon,
  MessageIcon,
  CommentPlusIcon,
  PaperclipIcon,
  FaCircleCheckIcon,
  CopyIcon,
  CheckDouble,
  DotsVerticalIcon,
  DownloadBoldIcon,
  SettingsIcon,
  MenuOutlinedIcon,
  FolderClosedIcon,
  NoteStickyIcon,
  FileAltIcon,
  CalendarXmark,
  ArrowDownToLine,
  ArrowUpFromLine,
  CloudDownloadIcon,
  ClipboardIcon,
  ScissorsIcon,
  FileCodeIcon,
  ExpandIcon,
  NewspaperIcon,
  CompressIcon,
  AiGenerateIcon,
  CloudIcon,
]

describe('Component: Icon', () => {
  it('should render correct layout based on props', () => {
    Icons.forEach((Icon) => {
      expect(shallow(<Icon />)).toMatchSnapshot()
    })
  })
})
