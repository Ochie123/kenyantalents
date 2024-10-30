import { configureStore } from "@reduxjs/toolkit";
import ChatSlice from "./Reducers/ChatSlice";
import ContactSlice from "./Reducers/ContactSlice";
import FormWizardTwoSlice from "./Reducers/FormLayout/FormWizardTwoSlice";
import NumberingWizardSlice from "./Reducers/FormLayout/NumberingWizardSlice";
import StudentWizardSlice from "./Reducers/FormLayout/StudentWizardSlice";
import TwoFactorSlice from "./Reducers/FormLayout/TwoFactorSlice";
import VerticalWizardSlice from "./Reducers/FormLayout/VerticalWizardSlice";
import LanguageSlice from "./Reducers/LanguageSlice";
import LayoutSlice from "./Reducers/LayoutSlice";
import FilterSlice from "./Reducers/FilterSlice";
import LetterBoxSlice from "./Reducers/LetterBoxSlice";
import ThemeCustomizerSlice from "./Reducers/ThemeCustomizerSlice";
import authReducer from "./features/auth/authSlice";
import ProductSlice from "./Reducers/ProductSlice";

const Store = configureStore({
  reducer: {
    auth: authReducer,
    layout: LayoutSlice,
    twoFactor: TwoFactorSlice,
    numberingWizard: NumberingWizardSlice,
    studentWizard: StudentWizardSlice,
    verticalWizard: VerticalWizardSlice,
    formWizardTwo: FormWizardTwoSlice,
    langSlice: LanguageSlice,
    contact: ContactSlice,
    chat: ChatSlice,
    filterData: FilterSlice,
    letterBox: LetterBoxSlice,
    themeCustomizer: ThemeCustomizerSlice,
    product:ProductSlice,
  },
});

export default Store;
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;