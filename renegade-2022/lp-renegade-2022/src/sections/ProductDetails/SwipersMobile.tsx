import productDetails, {
  ProductTab,
  ProductTabSlide,
} from '@/mocks/productDetails';
import { useMobxStores } from '@/store';
import RenegadeStore from '@/store/RenegadeStore';
import { FC, useState, Fragment } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { A11y, Keyboard, Thumbs } from 'swiper';
import styles from './SwipersMobile.module.scss';
import { observer } from 'mobx-react-lite';
import { ArrowButton, CTAButton, ResponsiveLazyImage } from '@/components';
import scssStyles from '@/utils/scssStyles';
import { ChevronBold } from '@/components/SvgComponents';
import DataLayer from '@/utils/DataLayer';
import getRangeOfEntries from '@/utils/getRangeOfEntries';
//import { VimeoEmbed } from '..';
import getClientXFromDifferentEvents from '@/utils/getClientXFromDifferentEvents';

SwiperCore.use([A11y, Keyboard, Thumbs]);

interface ISetReference {
  setReference: () => void;
}

const pageSubsection = 'tudo-sobre';

interface SlideProps {
  slide: ProductTabSlide;
  fileUrl?: string;
}

const Slide: FC<SlideProps> = observer(({ slide, fileUrl }) => {
  const store: RenegadeStore = useMobxStores();
  return (
    <div className={styles.slideContainer}>
      {slide.vimeoId?.mobile ? (
        <div className={styles.videoWrapper}>
          {/* <VimeoEmbed
            id={slide.vimeoId.mobile}
            title={slide.title}
          /> */}
        </div>
      ) : (
        <ResponsiveLazyImage
          alt={slide.alt}
          title={slide.title}
          src={slide.image.fullPath}
          src2={slide.image.fullPath2x}
          src3={slide.image.fullPath3x}
          containerClassName={styles.slideImageContainer}
          className={styles.slideImage}
        />
      )}
      <div className={styles.slideDetails}>
        {slide.highLightedFirst ? (
          <h2>
            <strong>{slide.titleFirst} </strong>
            {/* {slide.breakTitle ? <br /> : ' '} */}

            {slide.titleSecond}
          </h2>
        ) : (
          <h2>
            {slide.titleFirst}

            {/* {slide.breakTitle ? <br /> : ''} */}
            {slide.title === 'Para-Barro' ? '' : ' '}

            <strong>{slide.titleSecond}</strong>
          </h2>
        )}
        <div className={styles.slideDescription}>
          {slide.descriptionMobile}
          {!!fileUrl && (
            <CTAButton
              href={fileUrl}
              title="Baixe o catálogo"
              handleClick={() => {
                DataLayer.clickEvent({
                  element: 'Baixe o catálogo',
                  elementCategory: 'botao',
                  pageSection: pageSubsection,
                  pageSubsection:
                    productDetails.find(
                      (c) => c.id === store.selectedDetailTab,
                    )?.slug ?? ''
                });
              }}
              handleAuxClick={() => {
                DataLayer.clickEvent({
                  element: 'Baixe o catálogo',
                  elementCategory: 'botao',
                  pageSection: pageSubsection,
                  pageSubsection:
                    productDetails.find(
                      (c) => c.id === store.selectedDetailTab,
                    )?.slug ?? ''
                });
              }}
              className={styles.downloadButton}
              text="Baixe o catálogo"
              download
              target={'_blank'}
            />
          )}
        </div>
      </div>
    </div>
  );
});

interface TabProps extends ISetReference {
  tab: ProductTab;
  rerender: React.Dispatch<React.SetStateAction<boolean>>;
}

const Tab: FC<TabProps> = observer(
  ({ tab, rerender, setReference }) => {
    const store: RenegadeStore = useMobxStores();
    const [touchLocation, setTouchLocation] =
      useState<PointerEvent['clientX']>();
    const bulletProps = getRangeOfEntries(
      store.productDetailsMobileSwiperController[tab.id]
        ?.activeIndex,
      tab.children,
    );
    const activeIndex =
      store.productDetailsMobileSwiperController[tab.id]
        ?.activeIndex ?? 0;

    const getMaxHeight = (id: string) => {
      if (store.selectedDetailTab === id) {
        return 700;
      }
      return 0;
    };
    return (
      <>
        <button
          className={scssStyles([
            'accordion',
            'noFocus',
            store.selectedDetailTab === tab.id ? 'active' : '',
            styles.accordionTopic,
          ])}
          title={
            store.selectedDetailTab === tab.id
              ? 'Fechar'
              : 'Expandir'
          }
          onClick={() => {
            DataLayer.clickEvent({
              element: tab.title,
              elementCategory: 'botao',
              pageSection: 'conteudo',
              pageSubsection,
            });
            store.setSelectedDetailTab(
              store.selectedDetailTab === tab.id ? null : tab,
            );
          }}
        >
          <div className="chevron">
            <ChevronBold title={tab.title}/>
          </div>
          <p>{tab.title}</p>
        </button>
        <div
          id={`panel-${tab.id}`}
          className={scssStyles(['panel', styles.topicAnswer])}
          style={{
            maxHeight: getMaxHeight(tab.id),
          }}
        >
          <div id={`panel-body-${tab.id}`}>
            <div className={styles.controls}>
              <ArrowButton
                previous
                title={`Anterior: ${
                  tab.children[
                    (store.productDetailsMobileSwiperController[
                      tab.id
                    ]?.activeIndex ?? 0) <= 0
                      ? tab.children.length - 1
                      : (store
                          .productDetailsMobileSwiperController[
                          tab.id
                        ]?.activeIndex ?? 0) - 1
                  ]?.title ?? ''
                }`}
                disabled={
                  store.productDetailsMobileSwiperController[
                    tab.id
                  ]?.activeIndex === 0
                }
                handleClick={() => {
                  DataLayer.clickEvent({
                    element: 'anterior',
                    elementCategory: 'icone',
                    pageSection: pageSubsection,
                    pageSubsection:
                      productDetails.find(
                        (c) => c.id === store.selectedDetailTab,
                      )?.slug ?? '',
                  });
                  store.productDetailsMobileSwiperController[
                    tab.id
                  ]?.slidePrev();
                }}
              />
              <div className={styles.bullets}>
                {!!bulletProps.before &&
                  Array.from(Array(bulletProps.before).keys())
                    .slice(0, 2)
                    .map((_, i) => (
                      <button
                        key={`smaller-bullet-mobile-ProductDetails-before-${i}`}
                        aria-label='bullet'
                        className={scssStyles([
                          styles.bullet,
                          i == 1 || bulletProps.before === 1
                            ? 'mediumBullet'
                            : 'smallerBullet',
                        ])}
                        onClick={() => {
                          DataLayer.clickEvent({
                            element: `item-${activeIndex - 2}`,
                            elementCategory: 'icone',
                            pageSection: pageSubsection,
                            pageSubsection:
                              productDetails.find(
                                (c) =>
                                  c.id ===
                                  store.selectedDetailTab,
                              )?.slug ?? '',
                          });
                          if (
                            store.productDetailsMobileSwiperController &&
                            store
                              .productDetailsMobileSwiperController[
                              tab.id
                            ]
                          ) {
                            store.productDetailsMobileSwiperController[
                              tab.id
                            ]?.slideTo(activeIndex - 2);
                          }
                        }}
                      >
                        <span />
                      </button>
                    ))}
                {tab.children.map((c, index) => {
                  if (bulletProps.range.indexOf(index) === -1)
                    return null;
                  return (
                    <button
                      key={`bullet-s-mobile-j-${c.id}`}
                      title={c.title}
                      aria-label='bullet'
                      className={scssStyles([
                        styles.bullet,
                        store
                          .productDetailsMobileSwiperController[
                          tab.id
                        ]?.activeIndex === index
                          ? styles.active
                          : '',
                      ])}
                      onClick={() => {
                        DataLayer.clickEvent({
                          element: `item-${index + 1}`,
                          elementCategory: 'icone',
                          pageSection: pageSubsection,
                          pageSubsection:
                            productDetails.find(
                              (c) =>
                                c.id === store.selectedDetailTab,
                            )?.slug ?? '',
                        });
                        if (
                          c.index &&
                          store.productDetailsMobileSwiperController &&
                          store
                            .productDetailsMobileSwiperController[
                            tab.id
                          ]
                        ) {
                          store.productDetailsMobileSwiperController[
                            tab.id
                          ]?.slideTo(index);
                        }
                      }}
                    >
                      <span />
                    </button>
                  );
                })}
                {!!bulletProps.after &&
                  Array.from(Array(bulletProps.after).keys())
                    .slice(0, 2)
                    .map((_, i) => (
                      <button
                        key={`smaller-bullet-mobile-ProductDetails-after-${i}`}
                        aria-label='bullet'
                        className={scssStyles([
                          styles.bullet,
                          i == 0 || bulletProps.after === 1
                            ? 'mediumBullet'
                            : 'smallerBullet',
                        ])}
                        onClick={() => {
                          DataLayer.clickEvent({
                            element: `item-${activeIndex + 2}`,
                            elementCategory: 'icone',
                            pageSection: pageSubsection,

                            pageSubsection:
                              productDetails.find(
                                (c) =>
                                  c.id ===
                                  store.selectedDetailTab,
                              )?.slug ?? '',
                          });
                          if (
                            store.productDetailsMobileSwiperController &&
                            store
                              .productDetailsMobileSwiperController[
                              tab.id
                            ]
                          ) {
                            store.productDetailsMobileSwiperController[
                              tab.id
                            ]?.slideTo(activeIndex + 2);
                          }
                        }}
                      >
                        <span />
                      </button>
                    ))}
              </div>
              <ArrowButton
                title={`Próximo: ${
                  tab.children[
                    (store.productDetailsMobileSwiperController[
                      tab.id
                    ]?.activeIndex ?? 0) >=
                    tab.children.length - 1
                      ? 0
                      : (store
                          .productDetailsMobileSwiperController[
                          tab.id
                        ]?.activeIndex ?? 0) + 1
                  ]?.title ?? ''
                }`}
                disabled={
                  (store.productDetailsMobileSwiperController[
                    tab.id
                  ]?.activeIndex ?? tab.children.length - 1) >=
                  tab.children.length - 1
                }
                handleClick={() => {
                  DataLayer.clickEvent({
                    element: 'proximo',
                    elementCategory: 'icone',
                    pageSection: pageSubsection,
                    pageSubsection:
                      productDetails.find(
                        (c) => c.id === store.selectedDetailTab,
                      )?.slug ?? '',
                  });
                  store.productDetailsMobileSwiperController[
                    tab.id
                  ]?.slideNext();
                }}
              />
            </div>
            <Swiper
              observer
              observeParents
              parallax
              onSwiper={(e) => {
                store.setProductDetailsMobileSwiperController(
                  e,
                  tab.id,
                );
              }}
              controller={
                store.productDetailsMobileSwiperController[
                  tab.id
                ]
                  ? {
                      control: store
                        .productDetailsMobileSwiperController[
                        tab.id
                      ] as SwiperCore,
                    }
                  : undefined
              }
              onSlideChange={(e) => {
                store.setProductDetailsMobileSwiperController(
                  e,
                  tab.id,
                );
                setReference();
                rerender((r) => !r);
              }}
              onTouchStart={(_, event) => {
                const clientX =
                  getClientXFromDifferentEvents(event);
                setTouchLocation(clientX);
              }}
              onTouchEnd={(_, event) => {
                const clientX =
                  getClientXFromDifferentEvents(event);
                if (
                  clientX > (touchLocation ?? 0) + 30 ||
                  clientX < (touchLocation ?? 0) - 30
                ) {
                  DataLayer.swipeEvent({
                    element:
                      (touchLocation ?? 0) > clientX
                        ? 'proximo'
                        : 'anterior',
                    elementCategory: 'slide',
                    pageSection: pageSubsection,
                    pageSubsection: tab.title,
                  });
                }
              }}
            >
              {tab.children.map((slide) => (
                <SwiperSlide
                  key={`${tab.id}-x-mobile-0-${slide.id}`}
                >
                  <Slide slide={{ ...slide, tabId: tab.id }} fileUrl={tab.fileUrl} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </>
    );
  },
);

const SwipersMobile: FC<ISetReference> = observer(
  ({ setReference }) => {
    const [, rerender] = useState(false);
    return (
      <div className={styles.container}>
        {productDetails.map((tab) => (
          <Fragment key={`sw-frag-${tab.id}`}>
            <Tab
              setReference={setReference}
              tab={tab}
              rerender={rerender}
            />
          </Fragment>
        ))}
      </div>
    );
  },
);

export default SwipersMobile;
