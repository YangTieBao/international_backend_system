import FormWrapper from '@/components/FormWrapper'

export default function index() {
    const initForms = [
        {
            key: 1,
            label: '111111',
            type: 'input'
        },
        {
            key: 2,
            label: '2222',
            type: 'select'
        }
    ]
    return (
        <div className="list">
            <FormWrapper initForms={initForms}></FormWrapper>
        </div>
    )
}
