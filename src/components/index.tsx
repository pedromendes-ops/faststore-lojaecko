import { Simpletext } from "./sections/Simpletext";
import { BannerHtml } from "./sections/BannerHtml";
import { CardPost } from "./sections/CardPost";
import { FullBannerSlider } from "./sections/FullBannerSlider";
import { SimpleBanner } from "./sections/SimpleBanner";
import { CustomFooter } from "./sections/CustomFooter";
import { ProductShelf } from "./sections/ProductShelf";
import { CrossSellingShelf } from "./sections/CrossSellingShelf";
import { HeaderCustom } from "./common/header/HeaderCustom";
import { TopBar } from "./common/topbar";
import { BannerCustom } from "./common/bannerCustom";
import { CompleteCard } from "./common/CompleteCard";
import { CardVideo } from "./common/CardVideo";
import { ShopTheLook } from "./common/shopTheLook";
import { FirstModal } from "./common/FirstModal";
import { NewsletterCustom } from "./common/newsletterCustom";
import { StoreLocator } from "./common/StoreLocator";
import { FooterCustom } from "./common/footerCustom";
import { BreadcrumbPlp } from "./plp/breadcrumb-plp";
import ProductGalleryCustom from "./plp/plp";
import { CollectionGallery } from "./plp/collection";
import { ProductHighlights } from "./plp/productsHighlights";
import { TextSEO } from "./plp/textSEO";
import CustomProductDetails from "./sections/CustomProductDetails";
import ProductDetailsCustom from "./product/ProductDetailsCustom";
import DescriptionProduct from "./product/DescriptionProduct";
import ModelSize from "./product/ModelSize";
import YourviewsProductInfos from "./product/YourviewsProductInfos";
import NotifyMe from "./product/NotifyMe";
import { Franqueados } from "./lp/franqueados";
import { BannerWithText } from "./common/bannerWithText";
import { ContentTabs } from "./sections/ContentTabs";
import { GuideSize } from "./pages/guideSize";
import { Faq } from "./common/faq";
import { NeoAssist } from "./pages/neo";
import { SizeBay } from "./pages/pdp/sizeBay";
import { CollectionTag } from "./common/globalSections/collectionTag";
import { PricePix } from "./common/globalSections/pricePix";

export default {
  Simpletext,
  HeaderCustom,
  TopBar,
  BannerHtml,
  CardPost,
  FullBannerSlider,
  SimpleBanner,
  BannerCustom,
  ShopTheLook,
  FirstModal,
  CompleteCard,
  CardVideo,
  // Curated "looks" section: fetches kits from the account's Shop The Look IO
  // route through GraphQL and opens a modal to add each look's products to the
  // cart. See common/shopTheLook + cms_component__shopthelook.jsonc.
  NewsletterCustom,
  FooterCustom,
  CustomFooter,
  // Override of the native ProductShelf to expose the Pix discount as a
  // CMS-editable field on the product card (see sections/ProductShelf).
  ProductShelf,
  // Override of the native CrossSellingShelf (the PDP "buy together"/"also
  // viewed" shelf) so it renders this store's ProductCard instead of the core
  // one (see sections/CrossSellingShelf).
  CrossSellingShelf,
  // Override of the native Breadcrumb to expose a custom home label/icon and
  // divider on PLP/Search, keeping the stock look on PDP (see plp/breadcrumb-plp).
  Breadcrumb: BreadcrumbPlp,
  ProductGalleryCustom,
  // Standalone collection gallery: renders any VTEX collection (product
  // cluster) as a full PLP-style gallery on any page. The merchant supplies the
  // collection id via CMS; products are fetched client-side scoped to the
  // `productClusterIds` facet. See plp/collection.
  CollectionGalleryCustom: CollectionGallery,
  NotifyMe,
  // The Search page (/s) renders a native "ProductGallery" section from its
  // default CMS content. Map that section name to the same custom gallery used
  // on the PLP (registered under "ProductGalleryCustom") so search results get
  // the store's layout + ProductCard instead of the core default. The custom
  // section's props are a subset of the native schema, so the CMS content is
  // compatible.
  ProductGallery: ProductGalleryCustom,
  ProductHighlights,
  TextSEO,
  YourviewsProductInfos,
  // Override of the native ProductDetails: a swipeable carousel image gallery
  // and a store-owned settings block (price, quantity, SKU selector, buy
  // button). See sections/CustomProductDetails + product/ImageGallery +
  // product/ProductDetailsInfo.
  ProductDetails: CustomProductDetails,
  // Standalone fully-custom PDP section (own CMS schema, reads usePDP, composes
  // its own building blocks). See product/ProductDetailsCustom +
  // cms/faststore/components/cms_component__productdetailscustom.jsonc.
  ProductDetailsCustom,
  // Standalone PDP section with the product short description (specs) and the
  // description accordion. See product/DescriptionProduct +
  // cms/faststore/components/cms_component__descriptionproduct.jsonc.
  DescriptionProduct,
  ModelSize,
  StoreLocator,
  Franqueados,
  BannerWithText,
  ContentTabs,
  GuideSize,
  Faq,
  NeoAssist,
  SizeBay,
  CollectionTag,
  PricePix,
};
