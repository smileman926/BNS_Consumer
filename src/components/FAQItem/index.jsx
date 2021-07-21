import React, {useCallback, useState} from "react";
import styles from "./index.module.scss";
import clsx from 'clsx';

function FAQItem({faq}) {
  const [isOpen, setOpen] = useState(false);
  const handleOpenClick = useCallback(() =>{
      setOpen(!isOpen)
  },[isOpen]);
  return (
      <div className={clsx(styles.container, !isOpen && styles.maxHeight)}>
          <div className={clsx(styles.questCont,isOpen && styles.openQuestCont)}>
              <div className={clsx(styles.cnt, isOpen && styles.openedCnt)}>
                  <div className={clsx(styles.inpt, isOpen && styles.faqQuestOpened)}>{faq.question}</div>
                  <img
                      className={styles.icon}
                      alt='place'
                      src={isOpen?'/assets/icons/remove_circle.svg':'/assets/icons/add_circle.svg'}
                      onClick={handleOpenClick}
                  />
              </div>
              {isOpen && <div  className={styles.textArea} ><div>{faq.answer}</div></div>}
          </div>
      </div>
  );
}

export default FAQItem;
