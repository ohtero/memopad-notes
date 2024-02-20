import GuidePrompt from '../components/UI/GuidePrompt';
import { DesktopView, MobileView } from '../config/screensize';
import { ListSelection } from './ListSelection';

const guideText = 'Select a list or add a new list';

export function MainView() {
  return (
    <>
      <DesktopView>
        <GuidePrompt text={guideText} />
      </DesktopView>
      <MobileView>
        <ListSelection />
      </MobileView>
    </>
  );
}
