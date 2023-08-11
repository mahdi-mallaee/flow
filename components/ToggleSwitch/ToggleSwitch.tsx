import './ToggleSwitch.scss'

const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: Function }) => {
    return (
        <div className="toggle-switch" onClick={() => { onChange(!checked) }}>
            <input
                type="checkbox"
                className="toggle-switch-checkbox"
                checked={checked}
                onChange={() => {

                }}
            />
            <label className="toggle-switch-label">
                <span className="toggle-switch-inner" />
                <span className="toggle-switch-switch" />
            </label>
        </div>
    )
}

export default ToggleSwitch