import { h, defineComponent, reactive, watch} from 'vue'
import classNames from 'classnames'
import { Text, View } from '@tarojs/components'
import { CommonEvent } from '@tarojs/components/types/common'
import { delayQuerySelector } from '../../utils/common'

const AtAccordion = defineComponent({
    props: {
        open: { type: Boolean, default: false },
        customStyle: { type: Object || String, default: '' },
        className: { type: Array || String, default: '' },
        title: { type: String, default: '' },
        note: { type: String, default: '' },
        icon: { type: Object, default: () => ({ value: '' }) },
        hasBorder: { type: Boolean, default: true },
        isAnimation: { type: Boolean, default: true },
        onClick: { type: Function, default: () => {}}
    },

    setup(props, { slots }) {
        const state = reactive({
            isCompleted: true,
            startOpen: false,
            wrapperHeight: 0,
        })
       
        function handleClick(e: CommonEvent) {
            if (!state.isCompleted) return

            props.onClick && props.onClick(!props.open, e)
        }

        function toggleWithAnimation() {
            if (!state.isCompleted || !props.isAnimation) {
                console.log("early return in toggleWithAnimation")
                console.log(!state.isCompleted, !props.isAnimation)
                return
            }

            state.isCompleted = false
            delayQuerySelector(this, '.at-accordion__body').then((rect) => {
                const height = parseInt(rect[0].height.toString())
                const startHeight = props.open ? height : 0
                const endHeight = props.open ? 0 : height

                state.startOpen = false
                state.wrapperHeight = startHeight
                // TODO: animation bug, not smooth
                setTimeout(() => {
                    state.wrapperHeight = endHeight                    
                }, 100)
                setTimeout(() => {
                    state.isCompleted = true
                    state.wrapperHeight = 0
                }, 100)
            })
        }

        watch(() => props.open, (val, oldVal) => {
            if (val !== oldVal) {
                state.startOpen = !!val && !!props.isAnimation
                toggleWithAnimation()
            }
        })

        return () => {
             const rootClass = classNames('at-accordion', props.className)
             const prefixClass = (props.icon && props.icon.prefixClass) || 'at-icon'
             const iconClass = classNames({
                 [prefixClass]: true,
                 [`${prefixClass}-${props.icon && props.icon.value}`]: props.icon && props.icon.value,
                 'at-accordion__icon': true
             })
             const headerClass = classNames('at-accordion__header', {
                'at-accordion__header--noborder': !props.hasBorder
             })
             const arrowClass = classNames('at-accordion__arrow', {
                 'at-accordion__arrow--folded': !!props.open
             })
             const contentClass = classNames('at-accordion__content', {
                 'at-accordion__content--inactive': (!props.open && state.isCompleted) || state.startOpen
             })
             const iconStyle = {
                 color: (props.icon && props.icon.color) || '',
                 fontSize: (props.icon && `${props.icon.size}px`) || ''
             }
             const contentStyle = {
                 height: `${state.wrapperHeight}px`
             }

             if (state.isCompleted) {
                 contentStyle.height = ''
             }

            return h(View, { class: rootClass, style: props.customStyle }, [
                h(View, { class: headerClass, onTap: handleClick}, [
                    props.icon && props.icon.value && h(Text, { class: iconClass, style: iconStyle }),
                    h(View, { class: 'at-accordion__info' }, [
                        h(View, { class: 'at-accordion__info__title' }, props.title), 
                        h(View, { class: 'at-accordion__info__note' }, props.note)
                    ]),
                    h(View, { class: arrowClass }, [
                        h(Text, { class: classNames('at-icon', 'at-icon-chevron-down') })
                    ])
                ]),
                h(View, { class: contentClass, style: contentStyle }, [
                    h(View, { class: 'at-accordion__body' }, slots.default && slots.default())
                ])
            ])
        }
    }
})

export default AtAccordion
