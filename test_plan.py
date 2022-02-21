from app.planager.workflow.Plan import Plan
from app.planager.actionsets.data.data_viewer.DataViewer import DataViewer
from app.planager.actionsets.camera.planager_webcam.PlanagerWebcam import PlanagerWebcam

from rich import print_json


def test_action_update_when_connected():
    plan = Plan(headless=True)
    data_viewer = plan.addAction(DataViewer)
    webcam = plan.addAction(PlanagerWebcam)
    webcam.take_picture("some image data")
    plan.addLink(webcam.id, "image", data_viewer.id, "data")
    print_json(data=plan.toJSON())


def test_plan_data_flow():
    plan = Plan(headless=True)
    data_viewer = plan.addAction(DataViewer)
    webcam = plan.addAction(PlanagerWebcam)
    plan.addLink(webcam.id, "image", data_viewer.id, "data")
    webcam.take_picture("some image data")
    print(data_viewer.outports["data"].value)
    webcam.take_picture("other image data")
    print(data_viewer.outports["data"].value)
    plan.removeLink(webcam.id, "image", data_viewer.id, "data")
    print(data_viewer.outports["data"].value)
    webcam.take_picture("unconnected image data")
    print("webcam data:", webcam.outports["image"].value)
    print("data viewer data:", data_viewer.outports["data"].value)
    print_json(data=plan.toJSON())


if __name__ == "__main__":
    # test_plan_data_flow()
    test_action_update_when_connected()
